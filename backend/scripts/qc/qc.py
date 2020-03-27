# Runs a sample of addresses through Pollaris.
#
# Requires two environment variables; try these:
#   export GOOGLE_SHEETS_CREDENTIALS="ssm:/shared/google/credentials.json"
#   export GOOGLE_MAPS_API_KEY="ssm:/dev/pollaris/GOOGLE_MAPS_API_KEY"
#
# Sample command with arguments:
#   pipenv run python scripts/qc/qc.py dev NV --limit=4 --offset=10
#
import argparse
import json
import logging
import pprint
import time

import pygsheets
import requests
from google.oauth2.credentials import Credentials

from ew_common.get_env_variables import get_env_var

# First set up a Google Sheet with test addresses
# Fill in the sheet's URL in SHEET_URL below.
# Can add correct polling location values to the spreadsheet as well to do automated
# comparison of our tool vs. source of truth
SHEET_URL = ""
GOOGLE_SHEETS_CREDENTIALS = get_env_var("GOOGLE_SHEETS_CREDENTIALS")

SEARCH_API = "/api/v1/search/string"
POLLARIS_URLS = {
    "prod": "https://prod-pollaris-api.elizabethwarren.codes",
    "dev": "https://dev-pollaris-api.elizabethwarren.codes",
    "local": "http://localhost:8000",
}


def get_sheets_client():
    return pygsheets.client.Client(
        Credentials.from_authorized_user_info(json.loads(GOOGLE_SHEETS_CREDENTIALS))
    )


def normalize_for_match(s):
    return s.strip().lower()


def normalize_for_display(s):
    return s.replace("Caucus Location - ", "").replace("Caucus Location", "").strip()


def pollaris_search(one_line, pollaris_url, early):
    req = {"search_string": one_line}

    pollaris_resp = requests.post(pollaris_url, json=req).json()
    if early:
        pollaris_polling_locations = pollaris_resp.get("early_vote_locations")
    else:
        pollaris_polling_locations = pollaris_resp.get("polling_locations")
    match_type = pollaris_resp.get("match_type")
    if pollaris_polling_locations:
        pollaris_loc = pollaris_polling_locations[0]
        location_name = normalize_for_display(pollaris_loc["location_name"])
        address = pollaris_loc["address"]
        city = pollaris_loc["city"]
    else:
        pollaris_loc = location_name = address = city = "-"
        print(f"\nPollaris lookup failed; location {one_line}\nPollaris response:")
        pprint.pprint(pollaris_resp)

    if pollaris_resp.get("errors"):
        error = pollaris_resp.get("errors")[0].get("error_message")
    elif pollaris_resp.get("error_message"):
        error = pollaris_resp.get("error_message")
    else:
        error = None

    county = pollaris_resp.get("home_address", {}).get("county")
    pollaris_cells = [location_name, address, city, match_type, error, county]
    return pollaris_loc, pollaris_cells


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="QC Pollaris by searching a list of addresses from a gsheet"
    )
    parser.add_argument(
        "env", help="Which Pollaris environment to query: local, dev, or prod"
    )
    parser.add_argument("tab", help="Name of tab on the Google Spreadsheet to use")
    parser.add_argument(
        "--limit", type=int, default=10000, help="Max # of addresses to search"
    )
    parser.add_argument(
        "--offset", type=int, default=0, help="# of address rows to skip"
    )
    parser.add_argument(
        "--early",
        action="store_true",
        help="Whether to use early vote locations (default is regular vote)",
    )
    parser.add_argument(
        "--compare",
        action="store_true",
        help="Whether to compare the Pollaris values to the source of truth values",
    )
    args = parser.parse_args()
    print(args)
    offset = args.offset
    limit = args.limit
    query_pollaris = not args.skip_pollaris
    early = args.early
    compare = args.compare

    pollaris_url_base = POLLARIS_URLS[args.env]
    pollaris_url = pollaris_url_base + SEARCH_API

    sheets_client = get_sheets_client()
    sh = sheets_client.open_by_url(SHEET_URL)
    worksheet = sh.worksheet_by_title(args.tab)

    addresses = worksheet.get_values(
        start="A1",
        end="AX10000",
        include_tailing_empty=False,
        include_tailing_empty_rows=False,
    )

    header_to_idx = {}
    for idx, header in enumerate(addresses[0]):
        header_to_idx[header] = idx

    ROW_IDX_SKIP_HEADER = 1

    COL_IDX_ADDR1 = header_to_idx["addr1"]
    COL_IDX_CITY = header_to_idx["city"]
    COL_IDX_STATE = header_to_idx["state"]
    COL_IDX_ZIP = header_to_idx["zip"]
    COL_IDX_POLLARIS_NAME = header_to_idx["pollaris_name"]
    COL_IDX_POLLARIS_ERROR = header_to_idx["error"]

    for i, address in enumerate(addresses[ROW_IDX_SKIP_HEADER + offset :], offset + 2):
        # Enable this if hitting google spreadsheet write rate limits
        time.sleep(1)
        if i - 1 > limit + offset:
            break

        # Skip if there aren't enough columns to include address.
        if COL_IDX_ADDR1 >= len(address):
            continue

        addr1 = address[COL_IDX_ADDR1]

        # Skip if address is blank.
        if not addr1:
            continue

        city = address[COL_IDX_CITY]
        state = address[COL_IDX_STATE]
        zip5 = address[COL_IDX_ZIP]

        one_line = f"{addr1}, {city}, {state} {zip5}"
        print(f"Querying: {one_line}")

        pollaris_loc, pollaris_cells = pollaris_search(
            one_line, pollaris_url, early
        )
        worksheet.update_values((i, COL_IDX_POLLARIS_NAME + 1), [pollaris_cells])
