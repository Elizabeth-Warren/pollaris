import pytest
import responses
from django.forms import model_to_dict
from django.test import Client
from model_bakery import baker

from pollaris.app.models import SearchLog
from pollaris.app.tests.test_utils import (
    GOOGLE_CIVIC_URL_GENERIC,
    GOOGLE_GEOCODE_URL_GENERIC,
    SMARTY_URL_GENERIC,
    check_search_log,
    get_string_search,
    google_civic_response_ut,
    google_geocode_response,
    post_address_search,
)

POLLING_LOCATIONS = [
    {
        "location_name": "Salt Lake County Govt Bldg",
        "address": "2001 S State Street (100 E)",
        "city": "Salt Lake City",
        "state_code": "UT",
        "zip": "84190",
        "dates_hours": "",
        "location_id": 1,
    }
]
EV_LOCATIONS = [
    {
        "location_name": "Trolley Square (EV) PM",
        "address": "600 S 700 E, 2nd Floor Near Rodizio Grill",
        "city": "Salt Lake City",
        "state_code": "UT",
        "zip": "84102",
        "dates_hours": "02/26/2020 02:00 PM to 06:00 PM; 02/27/2020 02:00 PM to 06:00 PM; 02/28/2020 02:00 PM to 06:00 PM; 03/02/2020 02:00 PM to 06:00 PM;",
        "location_id": 1,
    },
    {
        "location_name": "SLCO Government Center (EV)",
        "address": "2001 S State St (100 E)",
        "city": "Salt Lake City",
        "state_code": "UT",
        "zip": "84114",
        "dates_hours": "02/18/2020 08:00 AM to 05:00 PM; 02/19/2020 08:00 AM to 05:00 PM; 02/20/2020 08:00 AM to 05:00 PM; 02/21/2020 08:00 AM to 05:00 PM; 02/24/2020 08:00 AM to 05:00 PM; 02/25/2020 08:00 AM to 05:00 PM; 02/26/2020 08:00 AM to 05:00 PM; 02/27/2020 08:00 AM to 05:00 PM; 02/28/2020 08:00 AM to 05:00 PM; 03/02/2020 08:00 AM to 05:00 PM;",
        "location_id": 2,
    },
    {
        "location_name": "Murray City Hall (EV) PM",
        "address": "5025 S State St (100 E)",
        "city": "Murray",
        "state_code": "UT",
        "zip": "84107",
        "dates_hours": "02/26/2020 02:00 PM to 06:00 PM; 02/27/2020 02:00 PM to 06:00 PM; 02/28/2020 02:00 PM to 06:00 PM; 03/02/2020 02:00 PM to 06:00 PM;",
        "location_id": 3,
    },
]

EXPECTED_RESPONSE_1 = {
    "errors": [],
    "home_address": {
        "street_number": "1985",
        "street": "S 1200 E",
        "city": "Salt Lake City",
        "state": "UT",
        "zip5": "84105",
        "county": "Salt Lake County",
    },
    "polling_locations": POLLING_LOCATIONS,
    "early_vote_locations": EV_LOCATIONS,
    "match_type": "MATCH_GOOGLE_CIVIC",
}

EXPECTED_RESPONSE_2 = {
    "errors": [],
    "home_address": {
        "street_number": "123",
        "street": "Main St",
        "city": "Boston",
        "county": "Suffolk County",
        "state": "MA",
        "zip9": "021293533",
        "zip5": "02129",
        "google_place_id": "ChIJd_ueCe1w44kRD_KFuN5w5nA",
        "latitude": 42.3744875,
        "longitude": -71.06347439999999,
    },
    "result_url": "https://elizabethwarren.com/vote?id=ChIJd_ueCe1w44kRD_KFuN5w5nA",
    "polling_locations": POLLING_LOCATIONS,
    "early_vote_locations": EV_LOCATIONS,
    "match_type": "MATCH_GOOGLE_CIVIC",
}
EXPECTED_SEARCH_LOG_1 = {
    "search_id": None,
    "success": True,
    "search_status": "MATCH_GOOGLE_CIVIC",
    "autocomplete_selected": None,
    "heap_id": None,
    "street_number": "1985",
    "street": "S 1200 E",
    "county": "Salt Lake County",
    "city": "Salt Lake City",
    "state_code": "UT",
    "zip5": "84105",
    "zip9": None,
    "search_string": None,
    "precinct": None,
    "source": None,
    "referrer": None,
    "other_data": {
        "latitude": None,
        "longitude": None,
        "google_civic_called": True,
        "smartystreets_called": True,
    },
}
EXPECTED_SEARCH_LOG_2 = {
    "search_id": None,
    "success": True,
    "search_status": "MATCH_GOOGLE_CIVIC",
    "autocomplete_selected": None,
    "heap_id": None,
    "street_number": "123",
    "street": "Main St",
    "county": "Suffolk County",
    "city": "Boston",
    "state_code": "MA",
    "zip5": "02129",
    "zip9": "021293533",
    "search_string": "1985 S 1200 E, Salt Lake City UT 84105",
    "precinct": None,
    "source": None,
    "referrer": None,
    "other_data": {
        "latitude": 42.3744875,
        "longitude": -71.06347439999999,
        "search_string": "1985 S 1200 E, Salt Lake City UT 84105",
        "google_civic_called": True,
        "smartystreets_called": True,
    },
}


@pytest.mark.django_db
@responses.activate
def test_search_google_civic(google_civic_response_ut):
    """Address components search -- call out to Google Civic for results"""
    address_request = {
        "address": {
            "street_number": "1985",
            "street": "S 1200 E",
            "city": "Salt Lake City",
            "state": "UT",
            "zip5": "84105",
            "county": "Salt Lake County",
        }
    }
    responses.add(responses.GET, SMARTY_URL_GENERIC, json=[], status=200)

    responses.add(
        responses.GET,
        GOOGLE_CIVIC_URL_GENERIC,
        json=google_civic_response_ut,
        status=200,
    )

    response = post_address_search(address_request)
    assert response.status_code == 200
    json_body = response.json()
    assert json_body == EXPECTED_RESPONSE_1

    search_log = check_search_log(True)
    # ID is non-deterministic so don't use it in comparison
    log_dict = model_to_dict(search_log)
    del log_dict["id"]
    assert log_dict == EXPECTED_SEARCH_LOG_1


@pytest.mark.django_db
@responses.activate
def test_search_google_civic_string_search(
    google_civic_response_ut, google_geocode_response
):
    """String search -- call out to Google Civic for results"""
    search_string = "1985 S 1200 E, Salt Lake City UT 84105"
    address_request = {"search_string": search_string}

    responses.add(
        responses.GET,
        GOOGLE_GEOCODE_URL_GENERIC,
        json=google_geocode_response,
        status=200,
    )

    responses.add(responses.GET, SMARTY_URL_GENERIC, json=[], status=200)

    responses.add(
        responses.GET,
        GOOGLE_CIVIC_URL_GENERIC,
        json=google_civic_response_ut,
        status=200,
    )

    response = get_string_search(address_request)
    assert response.status_code == 200
    json_body = response.json()
    assert json_body == EXPECTED_RESPONSE_2

    search_log = check_search_log(True)
    # ID is non-deterministic so don't use it in comparison
    log_dict = model_to_dict(search_log)
    del log_dict["id"]
    assert log_dict == EXPECTED_SEARCH_LOG_2
