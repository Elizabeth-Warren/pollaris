import json
from enum import Enum

from django.http import HttpResponseBadRequest

from pollaris.app.models import (
    DropboxLocation,
    EarlyVoteLocation,
    PollingLocation,
    PrecinctToDropboxLocation,
    PrecinctToEVLocation,
    PrecinctToPollingLocation,
)


class VoteType(Enum):
    EARLY_VOTE = 1
    REGULAR_VOTE = 2
    DROPBOX = 3


def get_location_model(vote_type):
    if vote_type == VoteType.EARLY_VOTE:
        return EarlyVoteLocation
    elif vote_type == VoteType.REGULAR_VOTE:
        return PollingLocation
    elif vote_type == VoteType.DROPBOX:
        return DropboxLocation
    else:
        raise Exception("Invalid vote_type")


def get_join_model(vote_type):
    if vote_type == VoteType.EARLY_VOTE:
        return PrecinctToEVLocation
    elif vote_type == VoteType.REGULAR_VOTE:
        return PrecinctToPollingLocation
    elif vote_type == VoteType.DROPBOX:
        return PrecinctToDropboxLocation
    else:
        raise Exception("Invalid vote_type")


class SearchStatus(Enum):
    MATCH_ADDRESS = (1, True)
    MATCH_ZIP9 = (2, True)
    MATCH_CITY = (3, True)
    EARLY_ONLY = (4, True)
    MATCH_COUNTY = (5, True)
    MATCH_GOOGLE_CIVIC = (6, True)
    NO_PRECINCT_FOR_ADDRESS = (7, False)
    NO_LOCATION_FOR_PRECINCT = (8, False)
    CANNOT_NORMALIZE_ADDRESS = (9, False)
    LOW_CONFIDENCE_ADDRESS = (10, False)
    LOW_CONFIDENCE_ZIP9 = (11, False)
    NO_COUNTY_MATCH = (12, False)
    BAD_REQUEST = (13, False)
    STATE_NOT_WHITELISTED = (14, False)

    def __init__(self, num, success):
        self.num = num  # arbitrary enum count
        self.success = success


class SearchStage(Enum):
    EARLY_VOTE = 1
    POLLING_LOCATION = 2
    GET_PRECINCT = 3


class PollarisAPIException(Exception):
    def __init__(self, error_message, search_status):
        self.error_message = error_message
        self.search_status = search_status


def bad_request(
    api_exception: PollarisAPIException = None,
    message: str = None,
    code: SearchStatus = None,
    details=None,
):
    if not message:
        message = api_exception.error_message
    msg = {"error_message": message, "error_code": code.name}
    if details:
        msg["details"] = details
    return HttpResponseBadRequest(json.dumps(msg), content_type="application/json")
