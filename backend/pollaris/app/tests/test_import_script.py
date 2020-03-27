import logging

import pytest
from model_bakery import baker

from pollaris.app.management.commands.import_locations_from_gsheet import (
    StatePollingLocationIngestor,
)
from pollaris.app.management.commands.state_config import (
    FULL_IMPORTS,
    OVERRIDE_MAPPING,
    StateInfo,
)
from pollaris.app.models import *
from pollaris.app.views.utils import get_join_model, get_location_model


@pytest.mark.skip
@pytest.mark.slow
@pytest.mark.parametrize("import_code", FULL_IMPORTS)
@pytest.mark.django_db
def test_run_import_script_for_state(import_code):
    """Run the import script for each state to make sure nothing is broken.
    Runs the test once for each import code currently registered in the script config file.
    Note: currently only tests full imports, not overrides"""
    logging.info(f"Running test import for {import_code}")
    state_info = FULL_IMPORTS[import_code]
    state_code = state_info.state_code

    ingestor = StatePollingLocationIngestor(import_code, state_info)
    ingestor.run_import()
    # Check that objects got imported
    location_model = get_location_model(state_info.vote_type)
    join_model = get_join_model(state_info.vote_type)

    precinct_count = Precinct.objects.filter(state_code=state_code).count()
    ptpl_count = join_model.objects.filter(state_code=state_code).count()
    # Should create one of PollingLocation or EarlyVoteLocation
    location_count = location_model.objects.filter(state_code=state_code).count()

    logging.info(
        f"Counts: precinct={precinct_count}, ptpl={ptpl_count}, polling_location={location_count}"
    )
    # TODO uncomment + figure out how to test correctly
    # assert precinct_count > 0
    # assert ptpl_count > 0
    # assert location_count > 0
    assert len(ingestor.errors) == 0


@pytest.mark.slow
@pytest.mark.django_db
def test_fake_override():
    """Create some polling locations, and override them with a Gsheet of test data:
    https://docs.google.com/spreadsheets/d/1AB5c7rNx0U_xJvd6sLmvq7YM9gyqEbBI4qbzaQE_6do/edit#gid=0"""

    TEST_OVERRIDE = StateInfo(
        state_code="ZZ",
        gsheet_id="1AB5c7rNx0U_xJvd6sLmvq7YM9gyqEbBI4qbzaQE_6do",
        worksheet_id="0",
        header_row=2,
        field_mapping=OVERRIDE_MAPPING,
        is_override=True,
    )

    p1 = baker.make("app.Precinct", van_precinct_id="12345")
    p2 = baker.make("app.Precinct", van_precinct_id="67890")
    pl1 = baker.make("app.PollingLocation", address="A", city="B", location_name="C")
    pl2 = baker.make(
        "app.PollingLocation",
        address="D",
        city="E",
        location_name="F",
        dates_hours="1-2pm",
    )
    ppl1 = baker.make("app.PrecinctToPollingLocation", location=pl1, precinct=p1)
    ppl2 = baker.make("app.PrecinctToPollingLocation", location=pl2, precinct=p2)

    ingestor = StatePollingLocationIngestor("TEST_OVERRIDE", TEST_OVERRIDE)
    ingestor.run_import()

    polling_loc1 = PollingLocation.objects.get(location_name="Zzz Community Center")
    assert polling_loc1.address == "123 Hedwig St"
    assert polling_loc1.city == "Zebra City"
    assert polling_loc1.zip == "98765"
    assert polling_loc1.dates_hours == "5am-8pm"
    assert float(polling_loc1.latitude) == 45.1234
    assert float(polling_loc1.longitude) == -70.5

    polling_loc2 = PollingLocation.objects.get(location_name="Zzz Elementary School")
    assert polling_loc2.address == "456 Main Ln"
    assert polling_loc2.city == "Boston"
    assert polling_loc2.zip == "12345"
    # Don't override dates_hours if a new value isn't given
    assert polling_loc2.dates_hours == "1-2pm"
    assert not polling_loc2.latitude
    assert not polling_loc2.longitude
