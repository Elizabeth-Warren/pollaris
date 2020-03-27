import json
import logging

from django.http import HttpResponseBadRequest, JsonResponse

from pollaris import settings
from smartystreets_python_sdk import ClientBuilder, StaticCredentials, exceptions
from smartystreets_python_sdk.us_street import Lookup


def geocode_api(request):
    """Takes an address string and returns a parsed version of that address from SmartyStreets. Will be used by
    frontend as a backup option to Google Places API """
    body = json.loads(request.body)
    address_string = body.get("search_string")
    if not address_string:
        msg = {"error_message": "search_string required in request"}
        return HttpResponseBadRequest(json.dumps(msg), content_type="application/json")

    normalized_address = address_lookup_by_string(address_string)

    if not normalized_address:
        msg = {"error_message": "No address returned from SmartyStreets"}
        return HttpResponseBadRequest(json.dumps(msg), content_type="application/json")

    return JsonResponse({"address": normalized_address})


def address_lookup_by_string(address_string):
    lookup = Lookup()
    lookup.street = address_string
    return address_lookup(lookup)


def address_lookup_by_components(address):
    lookup = Lookup()
    street_number = address.get("street_number")
    street = address.get("street")
    lookup.street = f"{street_number} {street}"
    lookup.city = address.get("city")
    lookup.state = address.get("state")
    lookup.zipcode = address.get("zip5")
    return address_lookup(lookup)


def address_lookup(lookup):
    """Note: Does not change capitalization of address components; users of function should do that if needed"""
    result = query_smartystreets(lookup)
    if not result:
        return None

    first_candidate = result[0]
    components = first_candidate.components
    metadata = first_candidate.metadata

    zip9 = None
    zip5 = components.zipcode
    plus4_code = components.plus4_code
    if zip5 and plus4_code:
        zip9 = f"{zip5}{plus4_code}"

    # Merge street components to match street_segments table
    street_components = [
        components.street_predirection,
        components.street_name,
        components.street_suffix,
        components.street_postdirection,
    ]

    street = " ".join(x for x in street_components if x)

    if components.default_city_name != components.city_name:
        logging.info(
            f"Different city vs default city: {components.city_name} vs {components.default_city_name}"
        )

    address_dict = {
        "street_number": components.primary_number,
        "street": street,
        "city": components.city_name,
        "county": metadata.county_name,
        "state": components.state_abbreviation,
        "zip5": zip5,
        "zip9": zip9,
        "latitude": metadata.latitude,
        "longitude": metadata.longitude,
    }
    return address_dict


def zip9_lookup_by_components(address):
    lookup = Lookup()
    street_number = address.get("street_number")
    street = address.get("street")
    lookup.street = f"{street_number} {street}"
    lookup.city = address.get("city")
    lookup.state = address.get("state")
    lookup.zipcode = address.get("zip5")
    return zip9_lookup(lookup)


def zip9_lookup(lookup):
    result = query_smartystreets(lookup)
    if not result:
        return None

    first_candidate = result[0]
    components = first_candidate.components

    zip5 = components.zipcode
    plus4_code = components.plus4_code
    if zip5 and plus4_code:
        zip9 = f"{zip5}{plus4_code}"
        return zip9

    return None


def query_smartystreets(lookup):
    logging.info("Looking up address in SmartyStreets")
    auth_id = settings.SMARTYSTREETS_AUTH_ID
    auth_token = settings.SMARTYSTREETS_AUTH_TOKEN
    credentials = StaticCredentials(auth_id, auth_token)
    client = ClientBuilder(credentials).build_us_street_api_client()

    try:
        client.send_lookup(lookup)
    except exceptions.SmartyException as err:
        logging.error(err)
        return None

    result = lookup.result
    if not result:
        logging.info("No address returned from SmartyStreets")
        return None

    return result
