import logging

import pytest
import responses
from model_bakery import baker

from pollaris.app.models import SearchLog
from pollaris.app.tests.test_utils import (
    SMARTY_URL_GENERIC,
    address_request,
    check_search_log,
    post_address_search,
    smarty_streets_response,
)

ADDRESS = "123 MAIN ST"
STREET_NUMBER = 123
STREET = "MAIN ST"
CITY = "BOSTON"
STATE = "MA"
ZIP = "12345"


@pytest.fixture
def api_request_without_zip9():
    return address_request("123", "main st", "Boston", "ma", "12345")


@pytest.fixture
def api_request_with_zip9(api_request_without_zip9):
    payload = api_request_without_zip9
    payload["address"]["zip9"] = "123456789"
    return payload


@pytest.fixture
def api_request_bad_zip9(api_request_without_zip9):
    payload = api_request_without_zip9
    payload["address"]["zip9"] = "12345"
    return payload


def assert_success(response, match_type):
    assert response.status_code == 200
    json_body = response.json()
    assert json_body["match_type"] == match_type
    assert json_body["home_address"]
    log = check_search_log(True)
    assert log.source == "web"
    assert log.search_id == "1234abcd"
    assert log.heap_id == "heap123"
    assert log.other_data.get("latitude")


def assert_fail(response, status_code, message, search_status):
    assert response.status_code == status_code
    json_body = response.json()
    json_body = json_body.get("errors")[0]
    assert json_body["error_message"] == message
    log = check_search_log(False)
    assert log.search_status == search_status


# TESTS

# Search -- Request contains Zip9 and address -- Search by address first -- Success
@pytest.mark.django_db
@responses.activate
def test_search_address_first_success(api_request_with_zip9):
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", precinct=precinct, zip9="123456789")
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)
    ss = baker.make(
        "app.StreetSegment",
        precinct=precinct,
        address=ADDRESS,
        city=CITY,
        state_code=STATE,
        zip=ZIP,
        confidence_score=0.95,
    )
    response = post_address_search(api_request_with_zip9)
    assert_success(response, "MATCH_ADDRESS")


# Search -- Request contains Zip9 -- Success
@pytest.mark.django_db
@responses.activate
def test_search_zip9_success(api_request_with_zip9):
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", precinct=precinct, zip9="123456789")
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)
    response = post_address_search(api_request_with_zip9)
    assert_success(response, "MATCH_ZIP9")


# Search -- Request contains Zip9 -- No precinct mapping for zip9 -- Address success
@pytest.mark.django_db
def test_search_zip_fail_address_success(api_request_with_zip9):
    precinct = baker.make("app.Precinct")
    ss = baker.make(
        "app.StreetSegment",
        precinct=precinct,
        address=ADDRESS,
        city=CITY,
        state_code=STATE,
        zip=ZIP,
    )
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)
    response = post_address_search(api_request_with_zip9)
    assert_success(response, "MATCH_ADDRESS")


# Search -- No Zip9 -- Address success
@pytest.mark.django_db
@responses.activate
def test_search_no_zip_address_success(api_request_without_zip9):
    precinct = baker.make("app.Precinct")
    ss = baker.make(
        "app.StreetSegment",
        precinct=precinct,
        address=ADDRESS,
        city=CITY,
        state_code=STATE,
        zip=ZIP,
    )
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)
    response = post_address_search(api_request_without_zip9)
    assert_success(response, "MATCH_ADDRESS")


# Search -- No zip9 -- Precinct but no polling place for address
@pytest.mark.django_db
@responses.activate
def test_search_by_address_no_location(api_request_without_zip9):
    precinct = baker.make("app.Precinct")
    ss = baker.make(
        "app.StreetSegment",
        precinct=precinct,
        address=ADDRESS,
        city=CITY,
        state_code=STATE,
        zip=ZIP,
    )
    response = post_address_search(api_request_without_zip9)
    assert_fail(response, 200, "No polling locations found", "NO_LOCATION_FOR_PRECINCT")
    search_log = SearchLog.objects.all().first()
    assert search_log.precinct == precinct


# Search -- zip9 in request -- No precinct match
@pytest.mark.django_db
@responses.activate
def test_search_with_zip9_no_precinct(api_request_with_zip9):
    responses.add(responses.GET, SMARTY_URL_GENERIC, json=[], status=200)

    response = post_address_search(api_request_with_zip9)
    assert_fail(
        response,
        200,
        "Error getting precinct for zip or street segment",
        "NO_PRECINCT_FOR_ADDRESS",
    )


# Search -- No precinct match, but early vote in nevada
@pytest.mark.django_db
@responses.activate
def test_search_nevada_no_precinct_early_vote():
    responses.add(responses.GET, SMARTY_URL_GENERIC, json=[], status=200)

    fake_county = "Susandale"
    nv_address_request = address_request("21", "Jump St", "Reno", "NV", "12345")
    nv_address_request["address"] = {
        "county": fake_county,
        **nv_address_request["address"],
    }
    precinct = baker.make("app.Precinct", state_code="NV", county=fake_county)
    pl = baker.make("app.EarlyVoteLocation")
    ppl = baker.make("app.PrecinctToEVLocation", location=pl, precinct=precinct)
    response = post_address_search(nv_address_request)
    assert_success(response, "MATCH_COUNTY")
    assert len(response.json()["early_vote_locations"])


# Search -- No precinct match on county for NV early vote
@pytest.mark.django_db
@responses.activate
def test_search_nevada_no_precinct():
    responses.add(responses.GET, SMARTY_URL_GENERIC, json=[], status=200)

    fake_county = "Susandale"
    nv_address_request = address_request("21", "Jump St", "Reno", "NV", "12345")
    nv_address_request["address"] = {
        "county": fake_county,
        **nv_address_request["address"],
    }
    response = post_address_search(nv_address_request)
    assert_fail(
        response,
        200,
        "Error getting precinct for zip or street segment",
        "NO_PRECINCT_FOR_ADDRESS",
    )


# Search -- Invalid JSON request format
@pytest.mark.django_db
@responses.activate
def test_search_zip9_invalid_json():
    bad_request = "asdf"
    response = post_address_search(bad_request)
    assert response.status_code == 400
    json_body = response.json()
    assert json_body["error_message"] == "Could not parse JSON"


# Searches that hit SmartyStreets:

# Search -- no zip9 in request -- no zip9 from SmartyStreets
@pytest.mark.django_db
@responses.activate
def test_search_smarty_no_zip9(api_request_without_zip9):
    # Mock out the request and response from SmartyStreets
    responses.add(responses.GET, SMARTY_URL_GENERIC, json=[], status=200)

    response = post_address_search(api_request_without_zip9)

    assert_fail(
        response,
        200,
        "Error getting precinct for zip or street segment",
        "NO_PRECINCT_FOR_ADDRESS",
    )


# Search -- no zip9 in request -- get zip9 from SmartyStreets -- no precinct found
@pytest.mark.django_db
@responses.activate
def test_search_smarty_zip9_no_match(api_request_without_zip9, smarty_streets_response):
    responses.add(
        responses.GET, SMARTY_URL_GENERIC, json=smarty_streets_response, status=200
    )

    response = post_address_search(api_request_without_zip9)

    assert_fail(
        response,
        200,
        "Error getting precinct for zip or street segment",
        "NO_PRECINCT_FOR_ADDRESS",
    )


# Search -- no zip9 in request -- get zip9 from SmartyStreets -- precinct found!
@pytest.mark.django_db
@responses.activate
def test_search_smarty_zip9_success(api_request_without_zip9, smarty_streets_response):
    precinct = baker.make("app.Precinct")
    ztp = baker.make(
        "app.Zip9ToPrecinct", precinct=precinct, zip9="021293533"
    )  # Zip9 from smarty streets sample response
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)
    responses.add(
        responses.GET, SMARTY_URL_GENERIC, json=smarty_streets_response, status=200
    )

    response = post_address_search(api_request_without_zip9)
    assert_success(response, "MATCH_ZIP9")


# Search -- invalid zip9 in request -- get zip9 from SmartyStreets -- precinct found!
@pytest.mark.django_db
@responses.activate
def test_search_smarty_zip9_success(api_request_bad_zip9, smarty_streets_response):
    precinct = baker.make("app.Precinct")
    ztp = baker.make(
        "app.Zip9ToPrecinct", precinct=precinct, zip9="021293533"
    )  # Zip9 from smarty streets sample response
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)
    responses.add(
        responses.GET, SMARTY_URL_GENERIC, json=smarty_streets_response, status=200
    )

    response = post_address_search(api_request_bad_zip9)
    assert_success(response, "MATCH_ZIP9")


# Search -- Zip9 -- Confidence high
@pytest.mark.django_db
@responses.activate
def test_search_zip9_high_confidence(api_request_with_zip9):
    precinct = baker.make("app.Precinct")
    ztp = baker.make(
        "app.Zip9ToPrecinct", precinct=precinct, zip9="123456789", confidence_score=0.99
    )
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)
    response = post_address_search(api_request_with_zip9)
    assert_success(response, "MATCH_ZIP9")


# Search -- Zip9 -- Confidence too low
@pytest.mark.django_db
@responses.activate
def test_search_zip9_low_confidence(api_request_with_zip9):
    precinct = baker.make("app.Precinct")
    ztp = baker.make(
        "app.Zip9ToPrecinct", precinct=precinct, zip9="123456789", confidence_score=0.92
    )
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)
    response = post_address_search(api_request_with_zip9)
    assert_fail(response, 200, "Confidence threshold too low", "LOW_CONFIDENCE_ZIP9")


# Search -- by address -- low confidence
@pytest.mark.django_db
@responses.activate
def test_search_address_low_confidence(api_request_without_zip9):
    precinct = baker.make("app.Precinct")
    ss = baker.make(
        "app.StreetSegment",
        precinct=precinct,
        address=ADDRESS,
        city=CITY,
        state_code=STATE,
        zip=ZIP,
        confidence_score=0.0,
    )
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)
    response = post_address_search(api_request_without_zip9)
    assert_fail(response, 200, "Confidence threshold too low", "LOW_CONFIDENCE_ADDRESS")


# Multiple polling locations for a precinct
@pytest.mark.django_db
@responses.activate
def test_multiple_polling_locs(api_request_with_zip9):
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", precinct=precinct, zip9="123456789")
    pl1 = baker.make("app.PollingLocation")
    pl2 = baker.make("app.PollingLocation")
    ppl1 = baker.make("app.PrecinctToPollingLocation", location=pl1, precinct=precinct)
    ppl2 = baker.make("app.PrecinctToPollingLocation", location=pl2, precinct=precinct)
    response = post_address_search(api_request_with_zip9)
    assert_success(response, "MATCH_ZIP9")
    json_body = response.json()
    assert len(json_body["polling_locations"]) == 2


# Dropbox locations
@pytest.mark.django_db
@responses.activate
def test_dropbox_search():
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", precinct=precinct, zip9="123456789")
    pl1 = baker.make("app.DropboxLocation")
    pl2 = baker.make("app.DropboxLocation")
    ppl1 = baker.make("app.PrecinctToDropboxLocation", location=pl1, precinct=precinct)
    ppl2 = baker.make("app.PrecinctToDropboxLocation", location=pl2, precinct=precinct)

    request = address_request("123", "Maple st", "Seattle", "WA", "12345")
    request["address"]["zip9"] = "123456789"
    logging.info(f"REQUEST {request}")
    response = post_address_search(request)
    response_json = response.json()
    logging.info(response_json)
    assert_success(response, "MATCH_ZIP9")
    assert len(response_json["dropbox_locations"]) == 2
