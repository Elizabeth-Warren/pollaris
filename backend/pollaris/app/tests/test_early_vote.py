import pytest
import responses
from django.test import Client
from model_bakery import baker

from pollaris.app.models import SearchLog
from pollaris.app.tests.test_utils import (
    SMARTY_URL_GENERIC,
    check_search_log,
    post_address_search,
)


@pytest.fixture
def county_early_vote_request():
    return {"state": "NV", "county": "Clark"}


@pytest.fixture
def nv_ev_zip9_request():
    return {"state": "NV", "zip9": "123456789"}


# Early vote search -- no lat/long data -- success
@responses.activate
@pytest.mark.django_db
def test_nv_early_success_no_lat_long(nv_ev_zip9_request):
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", zip9="123456789", precinct=precinct)
    pl1 = baker.make("app.EarlyVoteLocation")
    pl2 = baker.make("app.EarlyVoteLocation")
    pl3 = baker.make("app.EarlyVoteLocation")
    ppl1 = baker.make("app.PrecinctToEVLocation", location=pl1, precinct=precinct)
    ppl2 = baker.make("app.PrecinctToEVLocation", location=pl2, precinct=precinct)
    ppl3 = baker.make("app.PrecinctToEVLocation", location=pl3, precinct=precinct)
    response = post_address_search(nv_ev_zip9_request)
    assert response.status_code == 200
    json_body = response.json()
    # TODO is there a sort order we should have here?
    assert len(json_body["early_vote_locations"]) == 3
    search_logs = SearchLog.objects.all()
    count = search_logs.count()
    assert count == 1
    # Unclear if finding EV location but not regular location should be success or failure
    assert search_logs.first().success


# Early vote search -- failure -- no locations found for precinct
@responses.activate
@pytest.mark.django_db
def test_nv_early_fail_location(nv_ev_zip9_request):
    responses.add(responses.GET, SMARTY_URL_GENERIC, json=[], status=200)
    precinct = baker.make("app.Precinct")
    ztp = baker.make("app.Zip9ToPrecinct", zip9="123456789", precinct=precinct)
    response = post_address_search(nv_ev_zip9_request)
    assert response.status_code == 200
    json_body = response.json()
    assert json_body.get("early_vote_locations") is None
    assert len(json_body["errors"]) >= 1
    check_search_log(success=False)


# Early vote search -- failure -- no precinct found
@responses.activate
@pytest.mark.django_db
def test_nv_early_fail_precinct(nv_ev_zip9_request):
    responses.add(responses.GET, SMARTY_URL_GENERIC, json=[], status=200)
    response = post_address_search(nv_ev_zip9_request)
    assert response.status_code == 200
    json_body = response.json()
    assert json_body.get("early_vote_locations") is None
    assert len(json_body["errors"]) == 1
    check_search_log(success=False)


# Early vote and regular location search -- with lat/long data
@responses.activate
@pytest.mark.django_db
def test_nv_early_success_with_lat_long(nv_ev_zip9_request):
    precinct = baker.make("app.Precinct", county="Clark")
    ztp = baker.make("app.Zip9ToPrecinct", zip9="123456789", precinct=precinct)
    pl0 = baker.make("app.EarlyVoteLocation", latitude="35", longitude="-115")
    pl1 = baker.make("app.EarlyVoteLocation", latitude="37", longitude="-117")
    pl2 = baker.make(
        "app.EarlyVoteLocation",
        latitude="34",
        longitude="-114",
        dates_hours="Sa 2/15 10AM - 6PM, Tu 2/18 2PM - 8PM",
    )
    pl3 = baker.make(
        "app.EarlyVoteLocation",
        latitude="36",
        longitude="-116",
        dates_hours="Sa 2/15 10AM - 6PM, Su 2/16 1PM - 5PM, Mo 2/17 10AM - 6PM, Tu 2/18 8AM - 8PM",
    )
    ppl0 = baker.make("app.PrecinctToEVLocation", location=pl0, precinct=precinct)
    ppl1 = baker.make("app.PrecinctToEVLocation", location=pl1, precinct=precinct)
    ppl2 = baker.make("app.PrecinctToEVLocation", location=pl2, precinct=precinct)
    ppl3 = baker.make("app.PrecinctToEVLocation", location=pl3, precinct=precinct)
    pl_reg = baker.make("app.PollingLocation")
    ppl_reg = baker.make(
        "app.PrecinctToPollingLocation", location=pl_reg, precinct=precinct
    )

    nv_ev_zip9_request["latitude"] = "33"
    nv_ev_zip9_request["longitude"] = "-113"
    response = post_address_search(nv_ev_zip9_request)

    assert response.status_code == 200
    json_body = response.json()
    assert len(json_body["errors"]) == 0
    check_search_log(success=True)

    # Check regular polling location
    assert len(json_body["polling_locations"]) == 1
    assert json_body["polling_locations"][0]["location_name"] == pl_reg.location_name

    # Check that early vote locations returned are in correct sorted order
    assert len(json_body["early_vote_locations"]) == 4
    early_locations = json_body["early_vote_locations"]
    assert float(early_locations[0].get("latitude")) == 34
    assert float(early_locations[1].get("latitude")) == 35
    assert float(early_locations[2].get("latitude")) == 36
    assert float(early_locations[3].get("latitude")) == 37


# Early vote -- from CountyToEVLocation table
@responses.activate
@pytest.mark.django_db
@pytest.mark.skip(reason="No states currently use CountyToEVLocation")
def test_nc_early_success_with_lat_long():
    responses.add(responses.GET, SMARTY_URL_GENERIC, json=[], status=200)

    county_name = "Franklin"
    pl0 = baker.make("app.EarlyVoteLocation", latitude="35", longitude="-115")
    pl1 = baker.make("app.EarlyVoteLocation", latitude="34", longitude="-114")
    pl2 = baker.make(
        "app.EarlyVoteLocation",
        latitude="37",
        longitude="-117",
        dates_hours="Sa 2/15 10AM - 6PM, Tu 2/18 2PM - 8PM",
    )
    ppl0 = baker.make(
        "app.CountyToEVLocation", location=pl0, county=county_name, state_code="NC"
    )
    ppl1 = baker.make(
        "app.CountyToEVLocation", location=pl1, county=county_name, state_code="NC"
    )
    ppl2 = baker.make(
        "app.CountyToEVLocation", location=pl2, county=county_name, state_code="NC"
    )

    req = {"state": "NC", "county": "FRANKLIN", "latitude": "33", "longitude": "-113"}
    response = post_address_search(req)

    assert response.status_code == 200
    json_body = response.json()
    assert len(json_body["errors"]) == 0
    check_search_log(success=True)

    # Check regular polling location
    assert not json_body.get("polling_locations")

    # Check that early vote locations returned are in correct sorted order
    assert len(json_body["early_vote_locations"]) == 3
    early_locations = json_body["early_vote_locations"]
    assert float(early_locations[0].get("latitude")) == 34
    assert float(early_locations[1].get("latitude")) == 35
    assert float(early_locations[2].get("latitude")) == 37


# Early vote -- from CountyToEVLocation table -- none found
@responses.activate
@pytest.mark.django_db
def test_nc_early_fail():
    responses.add(responses.GET, SMARTY_URL_GENERIC, json=[], status=200)
    req = {"state": "NC", "county": "Franklin", "latitude": "33", "longitude": "-113"}
    response = post_address_search(req)

    assert response.status_code == 200
    json_body = response.json()
    assert len(json_body["errors"]) >= 1
    check_search_log(success=False)

    assert not json_body.get("polling_locations")
    assert not json_body.get("early_vote_locations")
