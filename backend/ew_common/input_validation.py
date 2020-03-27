import re

import phonenumbers
from nameparser import HumanName

POSTAL_CODE_RE = re.compile(r"[0-9]{5}")

STATE_TO_ABBREV = {
    "alabama": "AL",
    "alaska": "AK",
    "arizona": "AZ",
    "arkansas": "AR",
    "california": "CA",
    "colorado": "CO",
    "connecticut": "CT",
    "delaware": "DE",
    "district of columbia": "DC",
    "florida": "FL",
    "georgia": "GA",
    "hawaii": "HI",
    "idaho": "ID",
    "illinois": "IL",
    "indiana": "IN",
    "iowa": "IA",
    "kansas": "KS",
    "kentucky": "KY",
    "louisiana": "LA",
    "maine": "ME",
    "maryland": "MD",
    "massachusetts": "MA",
    "michigan": "MI",
    "minnesota": "MN",
    "mississippi": "MS",
    "missouri": "MO",
    "montana": "MT",
    "nebraska": "NE",
    "nevada": "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    "ohio": "OH",
    "oklahoma": "OK",
    "oregon": "OR",
    "pennsylvania": "PA",
    "puerto rico": "PR",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    "tennessee": "TN",
    "texas": "TX",
    "utah": "UT",
    "vermont": "VT",
    "virginia": "VA",
    "washington": "WA",
    "west virginia": "WV",
    "wisconsin": "WI",
    "wyoming": "WY",
}

STATE_ABBREVS = set(STATE_TO_ABBREV.values())


def extract_phone_number(t):
    e164 = extract_phone_number_e164(t)
    if e164:
        return e164.replace("+", "")


def extract_phone_number_e164(t):
    matcher = phonenumbers.PhoneNumberMatcher(t, "US")
    if matcher.has_next():
        return phonenumbers.format_number(
            matcher.next().number, phonenumbers.PhoneNumberFormat.E164
        )


def extract_postal_code(t):
    match = POSTAL_CODE_RE.search(t)
    if match:
        return match.group(0)


def extract_name(full_name):
    full_name = full_name.strip()
    name = HumanName(full_name)
    name.capitalize()
    first_name = " ".join(list(filter(None, [name.title, name.first])))
    last_name = name.last
    first_and_last_name = " ".join([first_name, last_name])
    return first_and_last_name, first_name, last_name


def extract_city_state(t):
    pieces = t.replace(",", " ").split()
    if len(pieces) < 2:
        return None, None

    state = pieces.pop().lower()
    if state == "virginia" and pieces[-1].lower() == "west":
        state = "WV"
        pieces.pop()
    elif state in STATE_TO_ABBREV:
        state = STATE_TO_ABBREV[state]
    elif " ".join([pieces[-1].lower(), state]) in STATE_TO_ABBREV:
        state = STATE_TO_ABBREV[" ".join([pieces[-1].lower(), state])]
        pieces.pop()
    elif state.upper() in STATE_ABBREVS:
        state = state.upper()
    else:
        return None, None

    city = " ".join(pieces)
    return city, state


def normalize_name(first_name, last_name):
    """Normalizes capitalization of first and last name."""
    name = HumanName()
    name.first = first_name
    name.last = last_name
    name.capitalize()
    return (name.first, name.last)
