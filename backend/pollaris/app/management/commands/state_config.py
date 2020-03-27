from dataclasses import dataclass

from pollaris.app.views.utils import VoteType

# Fill in with spreadsheet of override data
SUPER_TUESDAY_OVERRIDES_GSHEET = ""

@dataclass
class FieldMap:
    """Spreadsheet header names for the state's spreadsheet"""

    van_precinct_id: str
    precinct_code: str
    county: str
    location_name: str
    street_address: str
    city: str
    zip: str
    dates_hours: str
    latitude: str = ""
    longitude: str = ""
    fips: str = ""
    location_id: str = ""


@dataclass
class StateInfo:
    """Info about the state's spreadsheet"""

    state_code: str
    gsheet_id: str
    worksheet_id: str
    field_mapping: FieldMap
    header_row: int = 2  # Row number of the header row
    is_override: bool = False
    vote_type: VoteType = VoteType.REGULAR_VOTE  # Regular vs. early polling locations


GENERIC_PRECINCT_MAPPING = FieldMap(
    van_precinct_id="van_precinct_id",
    precinct_code="precinct_code",
    county="county",
    fips="fips",
    location_name="location_name",
    street_address="street_address",
    city="city",
    zip="zip",
    dates_hours="dates_hours",
    latitude="latitude",
    longitude="longitude",
    # Since there's no given location ID, use van precinct ID
    location_id="van_precinct_id",
)

OVERRIDE_MAPPING = FieldMap(
    van_precinct_id="van_precinct_id",
    precinct_code="precinct_code",
    county="county",
    fips="fips",
    location_name="location_name",
    street_address="street_address",
    city="city",
    zip="zip",
    dates_hours="dates_hours",
    latitude="latitude",
    longitude="longitude",
    location_id="location_id",
)
STATE_IMPORT_MAP = dict(
    # Full state creations
    MA_VAN=StateInfo(
        state_code="MA",
        gsheet_id="1lG9sO_5-A92Lz2yZ23wIEoY10vpCJZbetGJNzFZR5DU",
        worksheet_id="1147111917",
        field_mapping=GENERIC_PRECINCT_MAPPING,
    ),
    # Super Tuesday overrides -- by precinct
    AR=StateInfo(
        state_code="AR",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="2004775103",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    MA=StateInfo(
        state_code="MA",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="1794055790",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    ME=StateInfo(
        state_code="ME",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="58752002",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    MN=StateInfo(
        state_code="MN",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="36556781",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    NC=StateInfo(
        state_code="NC",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="1588697584",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    OK=StateInfo(
        state_code="OK",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="1147111917",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    TN=StateInfo(
        state_code="TN",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="2138641570",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    VA=StateInfo(
        state_code="VA",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="0",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    VT=StateInfo(
        state_code="VT",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="123451854",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    # Super Tuesday overrides - by location_id (for states with multiple locations per precinct)
    CA=StateInfo(
        state_code="CA",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="501646843",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    CO=StateInfo(
        state_code="CO",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="179131591",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    TX=StateInfo(
        state_code="TX",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="699997043",
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    ),
    # Super Tuesday create rows
    AL=StateInfo(
        state_code="AL",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="1549361216",
        field_mapping=GENERIC_PRECINCT_MAPPING,
    ),
    UT=StateInfo(
        state_code="UT",
        gsheet_id=SUPER_TUESDAY_OVERRIDES_GSHEET,
        worksheet_id="387613178",
        field_mapping=GENERIC_PRECINCT_MAPPING,
    ),
)


FULL_IMPORTS = {
    key: state_info
    for (key, state_info) in STATE_IMPORT_MAP.items()
    if not state_info.is_override
}
OVERRIDES = {
    key: state_info
    for (key, state_info) in STATE_IMPORT_MAP.items()
    if state_info.is_override
}
