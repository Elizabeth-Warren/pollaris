import logging
import re
from json import loads

from django.conf import settings
from django.core.management.base import BaseCommand

from ew_common.geocode import geocode
from ew_common.google_sheets_service import GoogleSheetsClient
from pollaris.app.models import *

# Usage example: python manage.py import_ev_by_counties

START_ID = 1000

# Google spreadsheet with the following columnns:
# state_code, county, fips, location_name, street_address, city, zip, date_hours, latitude, longitude, skip
SPREADSHEET_URL = ""
# Name of spreadsheet tab used
TAB_NAME = ""

class Command(BaseCommand):
    help = "Load nc county information from a spreadsheet"

    def _generate_lat_long(self, address, city, state_code, zip):
        address_string = f"{address} {city}, {state_code} {zip}"
        return geocode(address_string, settings.GOOGLE_MAPS_API_KEY)

    def _get_or_create_early_vote_locations(self, location_id, location_dict):
        location_name = location_dict["location_name"]
        address = location_dict["street_address"]
        city = location_dict["city"]
        state_code = location_dict["state_code"]
        zip5 = location_dict["zip"]
        dates_hours_raw = location_dict["date_hours"]
        dates_hours_formatted = self.format_date(dates_hours_raw)
        latitude = location_dict.get("latitude")
        longitude = location_dict.get("longitude")

        ev_location, _ = EarlyVoteLocation.objects.get_or_create(
            location_id=location_id, location_name=location_name
        )
        ev_location.address = address
        ev_location.city = city
        ev_location.state_code = state_code
        ev_location.zip = zip5
        ev_location.dates_hours = dates_hours_formatted

        # Get lat/long from spreadsheet or from Google geocode API call
        if latitude and longitude:
            logging.info("got lat/long from spreadsheet")
            ev_location.latitude = latitude
            ev_location.longitude = longitude
        elif not (ev_location.longitude and ev_location.latitude):
            # TODO re-calculate lat/long if address changes
            geocode_info = self._generate_lat_long(address, city, state_code, zip5)
            if geocode_info:
                ev_location.longitude = geocode_info["lng"]
                ev_location.latitude = geocode_info["lat"]

        ev_location.save()
        return ev_location

    def _add_county_to_early_vote_locations(self, location, county, state_code):
        county_to_ev, created = CountyToEVLocation.objects.get_or_create(
            location=location, county=county, state_code=state_code
        )
        return county_to_ev, created

    def _get_data_from_sheet(self, sheet_client, url, tab_name):
        columns = [
            "state_code",
            "county",
            "location_name",
            "street_address",
            "city",
            "zip",
            "date_hours",
            "latitude",
            "longitude",
            "skip",
        ]
        return sheet_client.get_values_from_sheet(url, tab_name, columns, header_rows=2)

    def format_date(self, date_time_str):
        regex = "([0-9\/]{7}), ([0-9:APM -]+)"
        matches = re.findall(regex, date_time_str)
        final = []
        current_start_date = None
        latest_matching_date = None
        current_time_str = None
        for date_str, time_str in matches:
            if time_str == current_time_str:
                latest_matching_date = date_str
            else:
                if current_start_date:
                    date_range_str = self.build_date_time_str(
                        current_start_date, latest_matching_date, current_time_str
                    )
                    final.append(date_range_str)
                current_start_date = date_str
                latest_matching_date = date_str
                current_time_str = time_str
        date_range_str = self.build_date_time_str(
            current_start_date, latest_matching_date, current_time_str
        )
        final.append(date_range_str)
        return "; ".join(final)

    def build_date_time_str(
        self, current_start_date, latest_matching_date, current_time_str
    ):
        if current_start_date == latest_matching_date:
            return f"{current_start_date}, {current_time_str}"
        else:
            return f"{current_start_date} - {latest_matching_date}, {current_time_str}"

    def handle(self, *args, **options):
        credentials = ssm.get("/shared/google/hedwig/credentials.json")
        client = GoogleSheetsClient(loads(credentials))
        url = SPREADSHEET_URL
        tab_name = TAB_NAME
        location_id = START_ID
        # TODO ability to re-load correctly after the first run!
        all_locations = self._get_data_from_sheet(client, url, tab_name)
        logging.info(f"Number of locations: {len(all_locations)}")
        for location_dict in all_locations:
            location_id += 1
            logging.info(location_id)

            skip = location_dict.get("skip", "")
            if skip.lower() in ["yes", "y"]:
                logging.info(f"skipping row {location_dict}")
                continue

            county = location_dict["county"]
            state_code = location_dict["state_code"]
            location_name = location_dict["location_name"]

            ev_location = self._get_or_create_early_vote_locations(
                location_id, location_dict
            )

            county_to_ev_location, created = self._add_county_to_early_vote_locations(
                ev_location, county, state_code
            )
            if created:
                logging.info(f"{location_name} to early vote location was created")
