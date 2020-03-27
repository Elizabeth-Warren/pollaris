import pytest
import responses
from django.forms import model_to_dict
from django.test import Client
from model_bakery import baker

from pollaris.app.models import SearchLog
from pollaris.app.tests.test_utils import (
    GOOGLE_GEOCODE_URL_GENERIC,
    SMARTY_URL_GENERIC,
    check_search_log,
    get_string_search,
    google_geocode_bad_response,
    google_geocode_response,
    google_geocode_response_no_zip9,
    google_geocode_response_nv,
    post_string_search,
    smarty_streets_response,
)

ADDRESS_STRING = "123 North Main ST boston MA"
SAMPLE_ZIP9 = "021293533"


@pytest.fixture
def address_string_request():
    return {"search_string": ADDRESS_STRING}


# Tests for shortcode/QC API that takes address string, parses address, and looks up polling location for address


@pytest.mark.django_db
@responses.activate
def test_search_by_string_success(address_string_request, google_geocode_response):
    """Search by string; Google returns zip9; find match"""
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", precinct=precinct, zip9=SAMPLE_ZIP9)
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)

    responses.add(
        responses.GET,
        GOOGLE_GEOCODE_URL_GENERIC,
        json=google_geocode_response,
        status=200,
    )

    response = post_string_search(address_string_request)
    assert response.status_code == 200
    json_body = response.json()
    assert json_body["match_type"] == "MATCH_ZIP9"
    check_search_log(True)
    assert json_body["home_address"]
    assert json_body["result_url"]


@pytest.mark.django_db
@responses.activate
def test_search_by_string_ss_fallback_success(
    address_string_request, smarty_streets_response, google_geocode_response_no_zip9
):
    """Search by string; Google doesn't return zip9; no address match; smartystreets fallback finds zip9; find match"""

    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", precinct=precinct, zip9=SAMPLE_ZIP9)
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)

    responses.add(
        responses.GET,
        GOOGLE_GEOCODE_URL_GENERIC,
        json=google_geocode_response_no_zip9,
        status=200,
    )

    responses.add(
        responses.GET, SMARTY_URL_GENERIC, json=smarty_streets_response, status=200
    )

    response = post_string_search(address_string_request)
    assert response.status_code == 200
    json_body = response.json()
    assert json_body["match_type"] == "MATCH_ZIP9"
    check_search_log(True)
    assert json_body["home_address"]
    assert json_body["result_url"]


@pytest.mark.django_db
@responses.activate
def test_search_by_string_failure(google_geocode_bad_response):
    address_str = "123 alkdfjaskdfjjk st"
    request = {"search_string": address_str}

    responses.add(
        responses.GET,
        GOOGLE_GEOCODE_URL_GENERIC,
        json=google_geocode_bad_response,
        status=200,
    )
    response = post_string_search(request)
    assert response.status_code == 400
    json_body = response.json()
    assert json_body["error_message"] == "Could not parse address"
    check_search_log(False)


@pytest.mark.django_db
@responses.activate
def test_search_metadata(google_geocode_response):
    """Make sure metadata from GET request gets into search log correctly"""
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", precinct=precinct, zip9=SAMPLE_ZIP9)
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)

    responses.add(
        responses.GET,
        GOOGLE_GEOCODE_URL_GENERIC,
        json=google_geocode_response,
        status=200,
    )

    url = "/api/v1/search/string?search_string=fake%20address&phone_number=1112223333&email=test@ew.com&source=mc&asdf=1234"
    response = Client().get(url)
    assert response.status_code == 200
    search_log = check_search_log(True)
    assert search_log.search_string == "fake address"
    assert search_log.heap_id == "1112223333"
    assert search_log.source == "mc"
    other_data = search_log.other_data
    assert other_data["email"] == "test@ew.com"
    assert other_data["phone_number"] == "1112223333"
    assert other_data["asdf"] == "1234"


@pytest.mark.django_db
@responses.activate
def test_get_search_by_string_success(address_string_request, google_geocode_response):
    """Successful search with a GET request"""
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", precinct=precinct, zip9=SAMPLE_ZIP9)
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)

    responses.add(
        responses.GET,
        GOOGLE_GEOCODE_URL_GENERIC,
        json=google_geocode_response,
        status=200,
    )

    response = get_string_search(address_string_request)
    assert response.status_code == 200
    json_body = response.json()
    assert json_body["match_type"] == "MATCH_ZIP9"
    check_search_log(True)
    assert json_body["home_address"]
    assert json_body["result_url"]


@pytest.mark.django_db
@responses.activate
def test_get_search_by_string_invalid_address(google_geocode_bad_response):
    """Failed search with a GET request"""
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", precinct=precinct, zip9=SAMPLE_ZIP9)
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)

    responses.add(
        responses.GET,
        GOOGLE_GEOCODE_URL_GENERIC,
        json=google_geocode_bad_response,
        status=200,
    )

    address_str = "alkdfjaskdfjjkljdflsdkj"
    request = {"search_string": address_str}
    response = get_string_search(request)
    assert response.status_code == 400


# Early vote and regular location search -- from search string
@pytest.mark.django_db
@responses.activate
def test_search_string_success(google_geocode_response_nv):
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", zip9="891455373", precinct=precinct)

    el0 = baker.make("app.EarlyVoteLocation", latitude="35", longitude="-115")
    el1 = baker.make("app.EarlyVoteLocation", latitude="37", longitude="-117")
    el2 = baker.make("app.EarlyVoteLocation", latitude="34", longitude="-114")
    el3 = baker.make("app.EarlyVoteLocation", latitude="36", longitude="-116")
    baker.make("app.PrecinctToEVLocation", location=el0, precinct=precinct)
    baker.make("app.PrecinctToEVLocation", location=el1, precinct=precinct)
    baker.make("app.PrecinctToEVLocation", location=el2, precinct=precinct)
    baker.make("app.PrecinctToEVLocation", location=el3, precinct=precinct)

    pl0 = baker.make("app.PollingLocation", latitude="35", longitude="-115")
    pl1 = baker.make("app.PollingLocation", latitude="37", longitude="-117")
    pl2 = baker.make("app.PollingLocation", latitude="34", longitude="-114")
    pl3 = baker.make("app.PollingLocation", latitude="36", longitude="-116")
    baker.make("app.PrecinctToPollingLocation", location=pl0, precinct=precinct)
    baker.make("app.PrecinctToPollingLocation", location=pl1, precinct=precinct)
    baker.make("app.PrecinctToPollingLocation", location=pl2, precinct=precinct)
    baker.make("app.PrecinctToPollingLocation", location=pl3, precinct=precinct)

    responses.add(
        responses.GET,
        GOOGLE_GEOCODE_URL_GENERIC,
        json=google_geocode_response_nv,
        status=200,
    )

    addr_string = "425 warmside dr, las vegas nv 89147"
    response = get_string_search({"search_string": addr_string})

    assert response.status_code == 200
    json_body = response.json()
    assert len(json_body["errors"]) == 0
    check_search_log(success=True)
    assert json_body["home_address"]
    assert json_body["result_url"]

    # Check that early vote locations returned are in correct sorted order
    assert len(json_body["early_vote_locations"]) == 4
    early_locations = json_body["early_vote_locations"]
    assert float(early_locations[0].get("latitude")) == 34
    assert float(early_locations[1].get("latitude")) == 35
    assert float(early_locations[2].get("latitude")) == 36
    assert float(early_locations[3].get("latitude")) == 37

    # Check regular polling locations
    assert len(json_body["polling_locations"]) == 4
    polling_locations = json_body["polling_locations"]
    assert float(polling_locations[0].get("latitude")) == 34
    assert float(polling_locations[1].get("latitude")) == 35
    assert float(polling_locations[2].get("latitude")) == 36
    assert float(polling_locations[3].get("latitude")) == 37


@pytest.mark.django_db
@responses.activate
def test_get_search_google_down(address_string_request, smarty_streets_response):
    """Failed search with a GET request"""
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", precinct=precinct, zip9=SAMPLE_ZIP9)
    pl = baker.make("app.PollingLocation")
    ppl = baker.make("app.PrecinctToPollingLocation", location=pl, precinct=precinct)

    # Google throws a 400 error, which only happens if something is wrong
    responses.add(responses.GET, GOOGLE_GEOCODE_URL_GENERIC, status=400)

    # Should fall back to this SS backup
    responses.add(
        responses.GET, SMARTY_URL_GENERIC, json=smarty_streets_response, status=200
    )

    response = post_string_search(address_string_request)
    assert response.status_code == 200
    json_body = response.json()
    assert json_body["match_type"] == "MATCH_ZIP9"
    check_search_log(True)
    assert json_body["home_address"]
