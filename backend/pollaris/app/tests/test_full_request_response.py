import pytest
import responses
from django.forms import model_to_dict
from model_bakery import baker

from pollaris.app.tests.test_utils import (
    GOOGLE_GEOCODE_URL_GENERIC,
    SMARTY_URL_GENERIC,
    check_search_log,
    google_geocode_response,
    google_geocode_response_no_zip9,
    post_address_search,
    post_string_search,
    smarty_streets_response,
)


@pytest.mark.django_db
@responses.activate
def test_full_req_response():
    precinct = baker.make(
        "app.Precinct",
        county="Clark",
        van_precinct_id=1617386,
        state_code="NV",
        fips="32003",
        precinct_code="3775",
    )
    ztp = baker.make("app.Zip9ToPrecinct", zip9="891455373", precinct=precinct)
    pl0 = baker.make(
        "app.EarlyVoteLocation",
        location_id=8975760059578666627,
        location_name="CSN Charleston Campus, B Lobby",
        address="6375 W. Charleston Blvd.",
        city="Las Vegas",
        state_code="NV",
        zip="89146",
        dates_hours="Tu 2/18 8AM - 8PM",
        latitude="36.157265000",
        longitude="-115.232410000",
    )
    pl1 = baker.make(
        "app.EarlyVoteLocation",
        location_id=1710710949278043919,
        location_name="UAW Local 3555",
        address="4310 Cameron St #11",
        city="Las Vegas",
        state_code="NV",
        zip="89103",
        dates_hours="Sa 2/15 10AM - 6PM, Su 2/16 1PM - 5PM, Mo 2/17 10AM - 6PM, Tu 2/18 8AM - 8PM",
        latitude="36.111626800",
        longitude="-115.203850000",
    )
    pl2 = baker.make(
        "app.EarlyVoteLocation",
        location_id=8323362047760264661,
        location_name="Temple Sinai",
        address="9001 Hillpointe Road",
        city="Las Vegas",
        state_code="NV",
        zip="89134",
        dates_hours="Sa 2/15 1PM - 6PM, Tu 2/18 10AM - 6PM",
        latitude="36.198949000",
        longitude="-115.292760000",
    )

    ppl0 = baker.make("app.PrecinctToEVLocation", location=pl0, precinct=precinct)
    ppl1 = baker.make("app.PrecinctToEVLocation", location=pl1, precinct=precinct)
    ppl2 = baker.make("app.PrecinctToEVLocation", location=pl2, precinct=precinct)
    pl_reg = baker.make(
        "app.PollingLocation",
        location_id=6709390971067927642,
        location_name="Caucus Day Location - WALTER JOHNSON MIDDLE SCHOOL",
        address="7701 DUCHARME AVE",
        city="LAS VEGAS",
        state_code="NV",
        zip="89145",
        dates_hours="Caucus Registration Opens at 10AM, Registration Closes at 12PM",
        latitude="36.168378000",
        longitude="-115.262055000",
    )
    ppl_reg = baker.make(
        "app.PrecinctToPollingLocation", location=pl_reg, precinct=precinct
    )

    request = {
        "address": {
            "street_number": "425",
            "street": "Warmside Dr",
            "city": "Las Vegas",
            "state": "NV",
            "zip5": "89145",
            "zip9": "891455373",
            "county": "Clark County",
            "latitude": 36.16741459999999,
            "longitude": -115.2447459,
        },
        "metadata": {
            "query_params": "",
            "source": "web",
            "normalized_by_google": True,
            "autocomplete_selected": True,
            "heap_id": "8135830208496912",
            "pollaris_search_id": "18658113641015635837",
        },
    }
    expected_response = {
        "errors": [],
        "precinct": {
            "van_precinct_id": 1617386,
            "state_code": "NV",
            "county": "Clark",
            "fips": "32003",
            "precinct_code": "3775",
        },
        "match_type": "MATCH_ZIP9",
        "early_vote_locations": [
            {
                "location_id": 8975760059578666627,
                "location_name": "CSN Charleston Campus, B Lobby",
                "address": "6375 W. Charleston Blvd.",
                "city": "Las Vegas",
                "state_code": "NV",
                "zip": "89146",
                "dates_hours": "Tu 2/18 8AM - 8PM",
                "latitude": "36.157265000",
                "longitude": "-115.232410000",
                "distance": 0.9825520301190909,
            },
            {
                "location_id": 8323362047760264661,
                "location_name": "Temple Sinai",
                "address": "9001 Hillpointe Road",
                "city": "Las Vegas",
                "state_code": "NV",
                "zip": "89134",
                "dates_hours": "Sa 2/15 1PM - 6PM, Tu 2/18 10AM - 6PM",
                "latitude": "36.198949000",
                "longitude": "-115.292760000",
                "distance": 3.453980218009656,
            },
            {
                "location_id": 1710710949278043919,
                "location_name": "UAW Local 3555",
                "address": "4310 Cameron St #11",
                "city": "Las Vegas",
                "state_code": "NV",
                "zip": "89103",
                "dates_hours": "Sa 2/15 10AM - 6PM, Su 2/16 1PM - 5PM, Mo 2/17 10AM - 6PM, Tu 2/18 8AM - 8PM",
                "latitude": "36.111626800",
                "longitude": "-115.203850000",
                "distance": 4.4750926279083,
            },
        ],
        "polling_locations": [
            {
                "location_id": 6709390971067927642,
                "location_name": "Caucus Day Location - WALTER JOHNSON MIDDLE SCHOOL",
                "address": "7701 DUCHARME AVE",
                "city": "LAS VEGAS",
                "state_code": "NV",
                "zip": "89145",
                "dates_hours": "Caucus Registration Opens at 10AM, Registration Closes at 12PM",
                "latitude": "36.168378000",
                "longitude": "-115.262055000",
            }
        ],
        "home_address": {
            "street_number": "425",
            "street": "Warmside Dr",
            "city": "Las Vegas",
            "state": "NV",
            "zip5": "89145",
            "zip9": "891455373",
            "county": "Clark County",
            "latitude": 36.16741459999999,
            "longitude": -115.2447459,
        },
        "pollaris_search_id": "18658113641015635837",
    }

    expected_search_log = {
        "heap_id": "8135830208496912",
        "autocomplete_selected": True,
        "search_status": "MATCH_ZIP9",
        "street": "Warmside Dr",
        "referrer": "http://test-referrer",
        "success": True,
        "zip9": "891455373",
        "street_number": "425",
        "zip5": "89145",
        "precinct": 1617386,
        "city": "Las Vegas",
        "other_data": {
            "latitude": 36.16741459999999,
            "longitude": -115.2447459,
            "query_params": "",
            "normalized_by_google": True,
        },
        "county": "Clark County",
        "state_code": "NV",
        "search_string": None,
        "source": "web",
        "search_id": "18658113641015635837",
    }

    actual_response = post_address_search(
        request, HTTP_REFERER="http://test-referrer"
    ).json()
    assert actual_response == expected_response

    log = check_search_log(True)
    log_dict = model_to_dict(log)
    # ID is non-deterministic so don't use it in comparison
    del log_dict["id"]
    assert log_dict == expected_search_log


@pytest.mark.django_db
@responses.activate
def test_full_req_response_string(
    google_geocode_response_no_zip9, smarty_streets_response
):
    responses.add(
        responses.GET,
        GOOGLE_GEOCODE_URL_GENERIC,
        json=google_geocode_response_no_zip9,
        status=200,
    )
    responses.add(
        responses.GET, SMARTY_URL_GENERIC, json=smarty_streets_response, status=200
    )
    precinct = baker.make(
        "app.Precinct",
        county="Suffolk",
        van_precinct_id=12345678,
        state_code="MA",
        fips="32003",
        precinct_code="3775",
    )
    ztp = baker.make("app.Zip9ToPrecinct", zip9="021293533", precinct=precinct)
    pl_reg = baker.make(
        "app.PollingLocation",
        location_id=6709390971067927642,
        location_name="Boston Public Library",
        address="7701 DUCHARME AVE",
        city="BOSTON",
        state_code="MA",
        zip="02139",
        dates_hours="8am-8pm",
    )
    ppl_reg = baker.make(
        "app.PrecinctToPollingLocation", location=pl_reg, precinct=precinct
    )

    request = {
        "search_string": "123 Main St, Charlestown MA",
        "metadata": {
            "query_params": "",
            "source": "web",
            "normalized_by_google": True,
            "autocomplete_selected": True,
            "heap_id": "8135830208496912",
            "pollaris_search_id": "18658113641015635837",
        },
    }
    expected_response = {
        "errors": [],
        "precinct": {
            "van_precinct_id": 12345678,
            "state_code": "MA",
            "county": "Suffolk",
            "fips": "32003",
            "precinct_code": "3775",
        },
        "match_type": "MATCH_ZIP9",
        "polling_locations": [
            {
                "location_id": 6709390971067927642,
                "location_name": "Boston Public Library",
                "address": "7701 DUCHARME AVE",
                "city": "BOSTON",
                "state_code": "MA",
                "zip": "02139",
                "dates_hours": "8am-8pm",
                "latitude": None,
                "longitude": None,
            }
        ],
        "home_address": {
            "street_number": "123",
            "street": "Main St",
            "city": "Boston",
            "state": "MA",
            "zip5": "02129",
            "county": "Suffolk County",
            "latitude": 42.3744875,
            "longitude": -71.06347439999999,
            "google_place_id": "ChIJd_ueCe1w44kRD_KFuN5w5nA",
            "postal_code_suffix": None,
        },
        "pollaris_search_id": "18658113641015635837",
        "result_url": "https://elizabethwarren.com/vote?id=ChIJd_ueCe1w44kRD_KFuN5w5nA",
    }

    expected_search_log = {
        "heap_id": "8135830208496912",
        "autocomplete_selected": True,
        "search_status": "MATCH_ZIP9",
        "street": "Main St",
        "referrer": "http://test-referrer",
        "success": True,
        "zip9": None,
        "street_number": "123",
        "zip5": "02129",
        "precinct": 12345678,
        "city": "Boston",
        "other_data": {
            "latitude": 42.3744875,
            "longitude": -71.06347439999999,
            "query_params": "",
            "normalized_by_google": True,
            "smartystreets_called": True,
        },
        "county": "Suffolk County",
        "state_code": "MA",
        "search_string": "123 Main St, Charlestown MA",
        "source": "web",
        "search_id": "18658113641015635837",
    }

    actual_response = post_string_search(
        request, HTTP_REFERER="http://test-referrer"
    ).json()
    assert actual_response == expected_response

    log = check_search_log(True)
    log_dict = model_to_dict(log)
    # ID is non-deterministic so don't use it in comparison
    del log_dict["id"]
    assert log_dict == expected_search_log
