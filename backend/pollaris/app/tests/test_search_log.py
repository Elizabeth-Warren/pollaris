import pytest
from django.test import Client

from pollaris.app.models import SearchLog


def post_to_search_log(payload):
    return Client().post("/api/v1/search/log", payload, content_type="application/json")


@pytest.mark.django_db
def test_search_log_request_search_string():
    payload = {
        "address_entered": {"search_string": "Needham, MA"},
        "heap_id": "1232435",
        "status": "INCOMPLETE_ADDRESS",
        "autocomplete_selected": True,
    }
    response = post_to_search_log(payload)
    assert response.status_code == 204
    search_logs = SearchLog.objects.all()
    count = search_logs.count()
    assert count == 1
    log = search_logs.first()
    assert not log.success
    assert log.search_status == "INCOMPLETE_ADDRESS"
    assert log.heap_id == "1232435"
    assert log.autocomplete_selected == True
    assert log.search_string == "Needham, MA"
    assert not log.city


@pytest.mark.django_db
def test_search_log_request_full_address():
    payload = {
        "address_entered": {
            "street_number": "3899",
            "street": "Grand Ave",
            "city": "Des Moines",
            "state": "IA",
            "zip5": "50312",
            "zip9": "503122807",
        },
        "heap_id": "asdfasdf",
        "status": "INCOMPLETE_ADDRESS",
        "autocomplete_selected": False,
    }
    response = post_to_search_log(payload)
    assert response.status_code == 204
    search_logs = SearchLog.objects.all()
    count = search_logs.count()
    assert count == 1
    log = search_logs.first()
    assert not log.success
    assert log.search_status == "INCOMPLETE_ADDRESS"
    assert log.heap_id == "asdfasdf"
    assert log.autocomplete_selected == False
    assert log.street_number == "3899"
    assert log.street == "Grand Ave"
    assert log.city == "Des Moines"
    assert log.state_code == "IA"
    assert log.zip5 == "50312"
    assert log.zip9 == "503122807"
