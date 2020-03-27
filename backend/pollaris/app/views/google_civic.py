import logging

import requests

GOOGLE_CIVIC_URL = "https://www.googleapis.com/civicinfo/v2/voterinfo"

# Map of states with Google Civic data -> Election ID
# Generated manually from https://www.googleapis.com/civicinfo/v2/elections?key=<key>
GOOGLE_CIVIC_ELECTION_MAP = {
    "SC": "4897",
    "AL": "4898",
    "AR": "4899",
    "CA": "4900",
    "CO": "4901",
    "MA": "4903",
    "MN": "4904",
    "NC": "4907",
    "OK": "4908",
    "TX": "4909",
    "UT": "4910",
    "VA": "4911",
    "VT": "4912",
    "MI": "4914",
    "MS": "4917",
    "IL": "4924",
    "LA": "4930",
}


def search_google_civic(state_code, address_string, address_json, api_key):
    logging.info("Searching Google Civic API")
    election_id = GOOGLE_CIVIC_ELECTION_MAP.get(state_code)
    if not address_string:
        address_string = address_string_from_json(address_json)
    if not address_string:
        return {}

    logging.info(f"Search string: {address_string}")
    params = {"address": address_string, "electionId": election_id, "key": api_key}
    try:
        return requests.get(GOOGLE_CIVIC_URL, params).json()
    except Exception as e:
        logging.exception(e)
        return {}


def address_string_from_json(address_json):
    street_number = address_json.get("street_number")
    street = address_json.get("street")
    city = address_json.get("city")
    state_code = address_json.get("state")
    postal_code = address_json.get("zip5")
    if any(x is None for x in [street_number, street, city, state_code]):
        logging.info(f"Missing address component(s) in address: {address_json}")
        return None
    return f"{street_number} {street}, {city} {state_code} {postal_code}"


def format_locations_from_civic(response_array, voting_type):
    """Formats an array of polling locations from Google Civic API into format expected by Pollaris"""
    if not response_array:
        return None
    # Note: we make a fake location ID for each location because FE needs one
    arr = [format_civic_object(item, i + 1) for i, item in enumerate(response_array)]
    logging.info(f"# {voting_type.name} locations: {len(arr)}")
    return arr


def format_civic_object(response, location_id):
    """Formats a single polling locations from Google Civic API into format expected by Pollaris"""
    address = response.get("address")
    # TODO how should we format these lines?
    addr_line = "\n".join(
        filter(None, (address.get("line1"), address.get("line2"), address.get("line3")))
    )
    # TODO also incorporate start/end dates?
    dates_hours = response.get("pollingHours")
    if dates_hours:
        dates_hours = dates_hours.replace("<br>", "; ").strip()

    return {
        "location_name": address.get("locationName") or response.get("name"),
        "address": addr_line,
        "city": address.get("city"),
        "state_code": address.get("state"),
        "zip": address.get("zip"),
        "dates_hours": dates_hours,
        "location_id": location_id,
    }
