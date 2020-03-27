import json
import logging
import re
from json import JSONDecodeError

from django.conf import settings
from django.forms.models import model_to_dict
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views import View

from ew_common.geocode import geocode_to_components
from geopy import distance
from pollaris.app.models import (
    CountyToEVLocation,
    Precinct,
    SearchLog,
    StreetSegment,
    Zip9ToPrecinct,
)
from pollaris.app.views import smarty_streets
from pollaris.app.views.google_civic import (
    GOOGLE_CIVIC_ELECTION_MAP,
    format_locations_from_civic,
    search_google_civic,
)
from pollaris.app.views.search_logging import add_address_data, add_metadata
from pollaris.app.views.utils import (
    PollarisAPIException,
    SearchStage,
    SearchStatus,
    VoteType,
    bad_request,
    get_join_model,
)

RESULTS_URL = "https://elizabethwarren.com/vote?id={}"

# Confidence needed to return a result for an ambiguous zip9 or address
CONFIDENCE_THRESHOLD = 0.95


def index(request):
    return HttpResponse("Hello, Pollaris")


class BaseAddressSearch(View):
    """Base class to search for polling locations. Other classes extend this one to provide specific API endpoints for searching.

    This code searches for all polling locations relevant to the given address. This can be any subset of regular polling
    locations and early vote locations, and dropbox locations. We'll look for the different types based on what data we
    have available for the state."""

    def __init__(self):
        self.address_json = {}
        self.address_string = None
        self.metadata = {}
        self.referrer = None
        self.precinct = None
        self.polling_locations = None
        self.early_vote_locations = None
        self.dropbox_locations = None
        self.status_enum = None
        self.errors = []
        self.home_address = None
        self.result_url = None
        self.pollaris_search_id = None
        self.smartystreets_called = False
        self.google_civic_called = False

    def create_response_body(self):
        response_body = {
            "errors": self.errors,
            "home_address": self.home_address,
            "pollaris_search_id": self.pollaris_search_id,
            "result_url": self.result_url,
            "polling_locations": self.polling_locations,
            "early_vote_locations": self.early_vote_locations,
            "dropbox_locations": self.dropbox_locations,
        }
        if self.precinct:
            response_body["precinct"] = model_to_dict(self.precinct)
        if self.status_enum and self.status_enum.success:
            response_body["match_type"] = self.status_enum.name

        # Filter out None values
        final_response = {k: v for k, v in response_body.items() if v is not None}
        return final_response

    def has_results(self):
        return (
            self.early_vote_locations
            or self.polling_locations
            or self.dropbox_locations
        )

    def search_by_address_dict(self):
        address = self.address_json
        self.home_address = address
        metadata = self.metadata

        logging.info(f"Address search request: {address}")
        state_code = address.get("state")

        # Different states can have different types of searches

        # Regular search path -- get address's precinct, then get locations for precinct
        self.search_by_precinct = True
        # Early vote lookup by another precinct in the county (somewhat of a hack to find EV locations if we can't
        # find a precinct match)
        self.early_vote_by_county_precinct = state_code in ["NV", "NC"]
        # Early vote lookup in CountyToEVLocation table
        self.early_vote_by_county_table = False
        # Google Civic API backup
        self.search_google_civic = state_code in GOOGLE_CIVIC_ELECTION_MAP

        # First try to do the regular search by getting precinct + locations for the precinct
        if self.search_by_precinct:
            self.polling_search_by_precinct(address)

        # First backup option is Google Civic API
        if self.search_google_civic and not self.has_results():
            self.search_by_google_civic(state_code, self.address_string, address)

        # Second backup is county-based matching
        early_vote_by_county = (
            self.early_vote_by_county_precinct or self.early_vote_by_county_table
        )
        if not self.precinct and not self.early_vote_locations and early_vote_by_county:
            self.get_early_vote_locations_by_county(address, state_code)

        if not self.has_results() and not self.errors:
            error = {
                "error_message": "No polling locations found",
                "stage": "LOCATION_SEARCH",
                "error_code": "NO_LOCATION_FOR_PRECINCT",
            }
            self.errors.append(error)
            self.status_enum = SearchStatus.NO_LOCATION_FOR_PRECINCT

        # TODO: Once FE accepts it, use address strings instead of Google IDs
        if address.get("google_place_id"):
            res_url = RESULTS_URL.format(address.get("google_place_id"))
            self.result_url = res_url

        if metadata:
            self.pollaris_search_id = metadata.get("pollaris_search_id")

        success = self.status_enum.success
        self.log_search_to_db(success, self.status_enum, precinct=self.precinct)

        response_body = self.create_response_body()
        return JsonResponse(response_body)

    def polling_search_by_precinct(self, address):
        try:
            self.precinct, self.status_enum = self.get_precinct(address)
        except PollarisAPIException as e:
            self.add_error(e, SearchStage.GET_PRECINCT)
            self.status_enum = e.search_status
            return

        try:
            self.early_vote_locations = self.locations_by_precinct(
                address, self.precinct.pk, VoteType.EARLY_VOTE
            )
        except PollarisAPIException as e:
            logging.info(
                f"No early vote locations found for precinct ID {self.precinct.pk}."
            )
        try:
            self.polling_locations = self.locations_by_precinct(
                address, self.precinct.pk, VoteType.REGULAR_VOTE
            )
        except PollarisAPIException as e:
            logging.info(
                f"No polling locations found for precinct ID {self.precinct.pk}. Message: {e}"
            )
        try:
            self.dropbox_locations = self.locations_by_precinct(
                address, self.precinct.pk, VoteType.DROPBOX
            )
        except PollarisAPIException as e:
            logging.info(
                f"No dropbox locations found for precinct ID {self.precinct.pk}."
            )

    def get_early_vote_locations_by_county(self, address, state_code):
        """Backup searches for when we can't find locations by precinct"""
        # Need to strip the word County to match the DB
        if not address.get("county"):
            return
        county = address["county"]
        ending = " County"
        if county.endswith(ending):
            county = county[: -len(ending)]
        if self.early_vote_by_county_precinct:
            # Get the first precinct for the given county
            example_precinct = Precinct.objects.filter(
                state_code=state_code, county__iexact=county
            ).first()
            if example_precinct:
                try:
                    ev_locations = self.locations_by_precinct(
                        address, example_precinct.pk, VoteType.EARLY_VOTE
                    )
                    self.early_vote_locations = ev_locations
                    self.status_enum = SearchStatus.MATCH_COUNTY
                    self.errors = []
                except PollarisAPIException as e:
                    self.add_error(e, SearchStage.EARLY_VOTE)
        if self.early_vote_by_county_table and not self.early_vote_locations:
            try:
                ev_locations = self.ev_locations_by_county(address, county, state_code)
                self.status_enum = SearchStatus.MATCH_COUNTY
                self.early_vote_locations = ev_locations
                self.errors = []
            except PollarisAPIException as e:
                self.add_error(e, SearchStage.EARLY_VOTE)
                self.status_enum = SearchStatus.NO_COUNTY_MATCH

    def search_by_google_civic(self, state_code, address_string, address_json):
        self.google_civic_called = True
        results = search_google_civic(
            state_code, address_string, address_json, settings.GOOGLE_MAPS_API_KEY
        )
        regular = results.get("pollingLocations")
        early = results.get("earlyVoteSites")
        dropbox = results.get("dropOffLocations")
        if regular or early or dropbox:
            self.status_enum = SearchStatus.MATCH_GOOGLE_CIVIC
            self.errors = []
            self.polling_locations = format_locations_from_civic(
                regular, VoteType.REGULAR_VOTE
            )
            self.early_vote_locations = format_locations_from_civic(
                early, VoteType.EARLY_VOTE
            )
            self.dropbox_locations = format_locations_from_civic(
                dropbox, VoteType.DROPBOX
            )
        else:
            logging.info("No results found from Google Civic")

    def log_search_to_db(self, success, status_enum, precinct=None):
        precinct_id = None
        if precinct:
            precinct_id = precinct.pk

        log = SearchLog(
            success=success,
            search_status=status_enum.name,
            precinct_id=precinct_id,
            referrer=self.referrer,
            other_data={},
        )
        add_address_data(log, self.address_json, self.address_string)
        if self.smartystreets_called:
            self.metadata["smartystreets_called"] = True
        if self.google_civic_called:
            self.metadata["google_civic_called"] = True
        add_metadata(log, self.metadata)
        log.save()

    def add_error(self, e, search_stage):
        error = {
            "error_message": e.error_message,
            "stage": search_stage.name,
            "error_code": e.search_status.name,
        }
        self.errors.append(error)

    def get_precinct(self, address):
        precinct_id, match_type = self.get_precinct_id(address)
        try:
            return Precinct.objects.get(pk=precinct_id), match_type
        except Precinct.DoesNotExist:
            raise PollarisAPIException(
                "Error getting precinct for precinctID",
                SearchStatus.NO_PRECINCT_FOR_ADDRESS,
            )

    def get_precinct_id(self, address):
        """Gets the precinct ID based on the address info passed in. Looks up precinct ID based on address components
        and/or zip9. Maybe also re-normalize the address with SmartyStreets if needed. If confidence score is too low,
        returns an error. Returns precinct ID, Match type """
        precinct_id, confidence_score, match_type = self.get_precinct_id_from_json(
            address
        )
        if not precinct_id and not self.smartystreets_called:
            # TODO skip searching smartystreets if the primary data source will be google civic?
            logging.info("Searching SmartyStreets")
            # We run the address through SmartyStreets to potentially get a zip9
            # as well as another possible normalization of the address
            self.smartystreets_called = True
            address2 = smarty_streets.address_lookup_by_components(address)
            logging.info(f"Address normalized by SmartyStreets: {address2}")
            if address2:
                precinct_id, confidence_score, match_type = self.get_precinct_id_from_json(
                    address2
                )
                # TODO add `self.home_address = address2` if we want to return SS-normalized address as home addr
        if not precinct_id:
            raise PollarisAPIException(
                "Error getting precinct for zip or street segment",
                SearchStatus.NO_PRECINCT_FOR_ADDRESS,
            )

        logging.info(
            f"Found precinct ID {precinct_id} by {match_type.name} with confidence score {confidence_score}"
        )

        if confidence_score is not None and confidence_score < CONFIDENCE_THRESHOLD:
            if match_type == SearchStatus.MATCH_ADDRESS:
                error_status = SearchStatus.LOW_CONFIDENCE_ADDRESS
            else:
                error_status = SearchStatus.LOW_CONFIDENCE_ZIP9

            logging.info(
                f"Precinct found had low confidence. Precinct ID: {precinct_id}. Match type: {match_type}. Confidence score: {confidence_score}"
            )
            raise PollarisAPIException("Confidence threshold too low", error_status)

        return precinct_id, match_type

    def get_precinct_id_from_json(self, address):
        # First try find precinct by address, then by zip9. If none found, return None
        # Returns Precinct ID, Confidence score, Match type
        try:
            precinct_id, confidence_score = self.precinct_id_by_address(address)
            return precinct_id, confidence_score, SearchStatus.MATCH_ADDRESS
        except PollarisAPIException:
            logging.info("Failed to get precinct by street address")
        try:
            precinct_id, confidence_score = self.precinct_id_by_zip9(
                address.get("zip9")
            )
            return precinct_id, confidence_score, SearchStatus.MATCH_ZIP9
        except PollarisAPIException:
            logging.info("Failed to get precinct by zip9")

        return None, None, None

    def precinct_id_by_address(self, address_json):
        # NOTE: Assumes all address components are all uppercase in the DB
        # Returns precinct ID, Confidence score
        logging.info("Searching by address")
        street_number = address_json.get("street_number")
        street = address_json.get("street")
        city = address_json.get("city")
        state_code = address_json.get("state")
        postal_code = address_json.get("zip5")

        if any(
            x is None for x in [street_number, street, city, state_code, postal_code]
        ):
            logging.info(f"Missing address component(s) in address: {address_json}")
            raise PollarisAPIException(
                "Missing required address component",
                SearchStatus.NO_PRECINCT_FOR_ADDRESS,
            )

        street_address = f"{street_number} {street}"

        try:
            street_segment = StreetSegment.objects.get(
                address=street_address.upper(),
                city=city.upper(),
                state_code=state_code.upper(),
                zip=postal_code,
            )
        except StreetSegment.DoesNotExist:
            raise PollarisAPIException(
                "No precinct found for street segment",
                SearchStatus.NO_PRECINCT_FOR_ADDRESS,
            )

        return street_segment.precinct_id, street_segment.confidence_score

    def precinct_id_by_zip9(self, zip9):
        # Returns precinct ID, Confidence score
        logging.info(f"Searching by zip9: {zip9}")
        if not zip9:
            raise PollarisAPIException(
                "No zip9 in address", SearchStatus.NO_PRECINCT_FOR_ADDRESS
            )
        try:
            ztp = Zip9ToPrecinct.objects.get(zip9=zip9)
            return ztp.precinct_id, ztp.confidence_score
        except Zip9ToPrecinct.DoesNotExist:
            raise PollarisAPIException(
                "No precinct found for zip", SearchStatus.NO_PRECINCT_FOR_ADDRESS
            )

    def ev_locations_by_county(self, address, county, state_code):
        """Find early vote locations from the CountyToEVLocation table and sort them in distance order"""
        county_evs = CountyToEVLocation.objects.filter(
            state_code=state_code, county__iexact=county
        ).select_related("location")
        if county_evs:
            locations = [model_to_dict(cev.location) for cev in county_evs]
            sorted_locations = self.sort_locations_by_dist(address, locations)
            return sorted_locations
        else:
            raise PollarisAPIException(
                "No early vote locations found by county", SearchStatus.NO_COUNTY_MATCH
            )

    def locations_by_precinct(self, address, precinct_id, vote_type):
        logging.info(f"Finding locations, type={vote_type.name}")
        locations = self.lookup_all_polling_places_by_precinct(precinct_id, vote_type)
        locations = [model_to_dict(loc) for loc in locations]
        # Sort locations by distance from user
        if len(locations) == 1:
            return locations
        sorted_locations = self.sort_locations_by_dist(address, locations)
        return sorted_locations

    def lookup_all_polling_places_by_precinct(self, precinct_id, voting_type):
        """Looks up all polling places for the precinct. Can look up early or regular locations."""
        join_model = get_join_model(voting_type)
        ppls = join_model.objects.filter(precinct_id=precinct_id).select_related(
            "location"
        )
        if not ppls:
            raise PollarisAPIException(
                f"No {voting_type.name} locations found for precinct",
                SearchStatus.NO_LOCATION_FOR_PRECINCT,
            )
        locations = [ppl.location for ppl in ppls]
        logging.info(f"Found {len(locations)} {voting_type.name} locations")
        return locations

    def sort_locations_by_dist(self, user_address, polling_locations):
        lat = user_address.get("latitude")
        long = user_address.get("longitude")
        if not lat or not long:
            logging.error("Can't find lat/long for user")
            return polling_locations
        user_loc = (float(lat), float(long))
        return sorted(
            polling_locations, key=lambda pl: self.dist_to_location(user_loc, pl)
        )

    def dist_to_location(self, user_loc, pl):
        """Use geopy to calculate the distance between a user's location and a polling location"""
        latitude = pl.get("latitude")
        longitude = pl.get("longitude")
        if latitude is None or longitude is None:
            logging.error("No lat/long found for polling location")
            return float("inf")
        polling_loc = (float(latitude), float(longitude))
        dist = distance.distance(user_loc, polling_loc)
        pl["distance"] = dist.miles
        return dist

    def get_first_open_4_days_nv(self, sorted_locations):
        """Finds the first Nevada early vote location that's open all four days. Assumes list is sorted in desired
        order. """
        regex = re.compile("Sa.*Su.*Mo.*Tu.*")
        for idx, loc in enumerate(sorted_locations):
            dates_hours = loc.get("dates_hours")
            match = regex.match(dates_hours)
            if match:
                loc["tag"] = "closest_open_4_days"
                return idx


class AddressComponentSearch(BaseAddressSearch):
    """Searches for polling locations given a dict of address components"""

    def post(self, request):
        try:
            body = json.loads(request.body)
            # Migrating request format; currently we accept 2 formats
            if body.get("address"):
                self.address_json = body.get("address")
            else:
                self.address_json = body
            self.metadata = body.get("metadata") or {}
        except (JSONDecodeError, AttributeError) as e:
            logging.error(f"Exception parsing request json: {type(e).__name__}: {e}")
            return bad_request(
                message="Could not parse JSON", code=SearchStatus.BAD_REQUEST
            )
        self.referrer = request.META.get("HTTP_REFERER")
        return self.search_by_address_dict()


class AddressStringSearch(BaseAddressSearch):
    """Takes an address string and returns the polling location(s) for the address. Used by shortcode
    interface, QC, and web (when already parsed address is not available). Normalizes the address using Google geocode,
    as well as SmartyStreets if needed."""

    def get(self, request):
        # GET requests will come from Mobile Commons, which can only send GET requests
        self.address_string = request.GET.get("search_string")
        self.metadata = request.GET.dict() or {}
        return self.search_by_address_string(request)

    def post(self, request):
        try:
            body = json.loads(request.body)
            self.address_string = body.get("search_string")
            self.metadata = body.get("metadata", {})
        except (JSONDecodeError, AttributeError) as e:
            logging.error(f"Exception parsing request json: {type(e).__name__}: {e}")
            return bad_request(
                message="Could not parse JSON", code=SearchStatus.BAD_REQUEST
            )
        return self.search_by_address_string(request)

    def search_by_address_string(self, request):
        if not self.address_string:
            msg = {"error_message": "search_string required in request"}
            return HttpResponseBadRequest(
                json.dumps(msg), content_type="application/json"
            )

        logging.info(f"String search request: {self.address_string}")

        try:
            self.address_json = geocode_to_components(
                self.address_string, settings.GOOGLE_MAPS_API_KEY
            )
        except Exception as e:
            logging.error(
                f"Google API request failed to complete with exception: {type(e).__name__} - {e}"
            )
            # Google API client will only throw an exception if API is down/unavailable. In that case, try using
            # SmartyStreets to normalize address instead
            self.address_json = smarty_streets.address_lookup_by_string(
                self.address_string
            )
            self.smartystreets_called = True

        self.referrer = request.META.get("HTTP_REFERER")

        if not self.address_json:
            self.log_search_to_db(False, SearchStatus.CANNOT_NORMALIZE_ADDRESS)
            return bad_request(
                message="Could not parse address", code=SearchStatus.BAD_REQUEST
            )

        return self.search_by_address_dict()
