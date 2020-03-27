# QC Pollaris by comparing the output of Pollaris API call to expected counts
#
# Requires two environment variables; try these:
#   export GOOGLE_SHEETS_CREDENTIALS="ssm:/shared/google/hedwig/credentials.json"
#   export GOOGLE_MAPS_API_KEY="ssm:/dev/pollaris/GOOGLE_MAPS_API_KEY"
#
# Sample command with arguments:
#   pipenv run python scripts/qc/qc_count.py dev "National QC" --limit=4 --offset=10
#
import json
import logging
import pprint

import pygsheets
import requests
from google.oauth2.credentials import Credentials

import click
from ew_common.get_env_variables import get_env_var

# Google spreadsheet containing test cases
SHEET_URL = ""
GOOGLE_SHEETS_CREDENTIALS = get_env_var("GOOGLE_SHEETS_CREDENTIALS")

SEARCH_API = "/api/v1/search/string"
POLLARIS_URLS = {
    "prod": "https://prod-pollaris-api.elizabethwarren.codes",
    "dev": "https://dev-pollaris-api.elizabethwarren.codes",
    "local": "http://localhost:8000",
}

REGULAR = "Regular"
EARLY = "Early"
DROPBOX = "Dropbox"
PRECINCT_ID = "Precinct ID"
COMPARE_COLS = [REGULAR, EARLY, DROPBOX, PRECINCT_ID]

MATCH = "Match?"


def get_sheets_client():
    return pygsheets.client.Client(
        Credentials.from_authorized_user_info(json.loads(GOOGLE_SHEETS_CREDENTIALS))
    )


def log_error(pollaris_resp):
    if pollaris_resp.get("errors"):
        error = pollaris_resp.get("errors")[0].get("error_message")
    elif pollaris_resp.get("error_message"):
        error = pollaris_resp.get("error_message")
    else:
        error = None
    if error:
        print(error)


def pollaris_search(one_line, pollaris_url):
    req = {"search_string": one_line}

    pollaris_resp = requests.post(pollaris_url, json=req).json()
    pl = pollaris_resp.get("polling_locations")
    ev = pollaris_resp.get("early_vote_locations")
    dl = pollaris_resp.get("dropbox_locations")

    precinct_id = ""
    precinct = pollaris_resp.get("precinct")
    if precinct:
        precinct_id = str(precinct.get("van_precinct_id"))

    log_error(pollaris_resp)

    return {
        REGULAR: get_count(pl),
        EARLY: get_count(ev),
        DROPBOX: get_count(dl),
        PRECINCT_ID: precinct_id,
    }


def get_count(locs):
    if not locs:
        return "0"
    elif len(locs) == 1:
        return "1"
    else:
        print("count:", len(locs))
        return "2+"


def col_idx(header, col_name):
    return header.index(col_name) + 1  # Convert from 0-indexed to 1-indexed


@click.command()
@click.argument("env")  # Which Pollaris environment to query: local, dev, or prod
@click.argument("tab")  # Name of tab on the Google Spreadsheet to use
@click.option("--limit", type=int, default=10000, help="Max # of addresses to search")
@click.option("--offset", type=int, default=0, help="# of address rows to skip")
def run(env, tab, limit, offset):
    pollaris_url_base = POLLARIS_URLS[env]
    pollaris_url = pollaris_url_base + SEARCH_API

    sheets_client = get_sheets_client()
    sh = sheets_client.open_by_url(SHEET_URL)
    worksheet = sh.worksheet_by_title(tab)

    header = worksheet.get_row(1)
    COL_IDX_MATCH = col_idx(header, MATCH)
    COL_IDX_REG = col_idx(header, REGULAR)
    errors = []

    for i, row in enumerate(worksheet.get_all_records(numericise_data=False)):
        if i < offset:
            continue

        row_num = i + 2
        print("row", row_num)
        # Enable this if hitting google spreadsheet write rate limits
        # time.sleep(1)
        if i - 1 > limit + offset:
            break

        addr1 = row.get("addr1")
        city = row.get("city")
        state = row.get("state")
        zip5 = row.get("zip")
        one_line = f"{addr1}, {city}, {state} {zip5}"
        print(one_line)

        pollaris_result = pollaris_search(one_line, pollaris_url)
        expected_result = {k: row[k] for k in COMPARE_COLS}
        match = pollaris_result == expected_result
        print(match)
        worksheet.update_value((row_num, COL_IDX_MATCH), match)
        if not match:
            err = {
                "address": one_line,
                "expected": expected_result,
                "actual": pollaris_result,
            }
            errors.append(err)
            pprint.pprint(err)

    if errors:
        addresses = "; ".join([e["address"] for e in errors])
        msg = f"Unexpected results from Pollaris QC: {addresses}"
        logging.error(msg)


if __name__ == "__main__":
    run()
