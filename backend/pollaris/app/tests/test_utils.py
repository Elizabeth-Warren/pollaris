import json
import os
import re

import pytest
from django.test import Client

from pollaris.app.models import SearchLog

SMARTY_URL_GENERIC = re.compile(
    "https://us-street.api.smartystreets.com/street-address.*"
)

GOOGLE_GEOCODE_URL_GENERIC = re.compile(
    "https://maps.googleapis.com/maps/api/geocode/json.*"
)

GOOGLE_CIVIC_URL_GENERIC = re.compile(
    "https://www.googleapis.com/civicinfo/v2/voterinfo.*"
)


@pytest.fixture
def smarty_streets_response():
    return get_json_response("data/smarty_streets_response.json")


@pytest.fixture
def google_geocode_response():
    return get_json_response("data/google_geocode_response.json")


@pytest.fixture
def google_geocode_response_nv():
    return get_json_response("data/google_geocode_response_nv.json")


@pytest.fixture
def google_geocode_response_no_zip9():
    return get_json_response("data/google_geocode_response_no_zip9.json")


@pytest.fixture
def google_civic_response_ut():
    return get_json_response("data/google_civic_response_ut.json")


@pytest.fixture
def google_geocode_bad_response():
    return {"results": [], "status": "ZERO_RESULTS"}


def post_address_search(payload, **kwargs):
    return Client().post(
        "/api/v1/search/address", payload, content_type="application/json", **kwargs
    )


def post_string_search(payload, **kwargs):
    return Client().post(
        "/api/v1/search/string", payload, content_type="application/json", **kwargs
    )


def get_string_search(payload, **kwargs):
    return Client().get("/api/v1/search/string", payload, **kwargs)


def get_json_response(filename):
    with open(os.path.join(os.path.dirname(__file__), filename)) as f:
        body = f.read()
        return json.loads(body)


def check_search_log(success):
    search_logs = SearchLog.objects.all()
    count = search_logs.count()
    assert count == 1
    log = search_logs.first()
    assert log.success == success
    return log


def address_request(street_number, street, city, state, postal_code):
    return {
        "address": {
            "street_number": street_number,
            "street": street,
            "city": city,
            "state": state,
            "zip5": postal_code,
            "longitude": 42,
            "latitude": 99,
        },
        "metadata": {
            "source": "web",
            "pollaris_search_id": "1234abcd",
            "heap_id": "heap123",
            "normalized_by_google": True,
        },
    }
