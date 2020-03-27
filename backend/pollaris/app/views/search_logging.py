import json
import logging

from django.http import HttpResponse

from pollaris.app.models import SearchLog


def log_failed_search(request):
    """API route to log searches that failed on FE to the Pollaris DB"""
    body = json.loads(request.body)
    logging.info(f"Logging failed search: {body}")
    address_json = body.pop("address_entered", {})
    status = body.pop("status", "")
    if not address_json or not status:
        logging.error(
            "address_entered and status are required in failed search log request"
        )
    log = SearchLog(
        success=False,
        search_status=status,
        referrer=request.META.get("HTTP_REFERER"),
        other_data={},
    )
    add_address_data(log, address_json)
    add_metadata(log, body)
    log.save()
    return HttpResponse(status=204)


def add_metadata(log, metadata):
    if not metadata:
        return

    # Copy metadata so we don't alter the original
    logging_metadata = metadata.copy()

    if logging_metadata.get("heap_id"):
        log.heap_id = logging_metadata.pop("heap_id")
    else:
        # If this request comes from Mobile Commons instead of the Web UI, use phone number as main person identifier
        log.heap_id = logging_metadata.get("phone_number")

    log.autocomplete_selected = logging_metadata.pop("autocomplete_selected", None)
    log.source = logging_metadata.pop("source", None)
    log.search_id = logging_metadata.pop("pollaris_search_id", None)
    log.other_data.update(logging_metadata)


def add_address_data(search_log, address_json=None, search_string=None):
    if not search_string:
        search_string = address_json.get("search_string")
    if search_string:
        search_log.search_string = search_string[:1000]
    if address_json:
        search_log.street_number = address_json.get("street_number")
        search_log.street = address_json.get("street")
        search_log.county = address_json.get("county")
        search_log.city = address_json.get("city")
        search_log.state_code = address_json.get("state")
        search_log.zip5 = address_json.get("zip5")
        search_log.zip9 = address_json.get("zip9")
        search_log.other_data["latitude"] = address_json.get("latitude")
        search_log.other_data["longitude"] = address_json.get("longitude")
