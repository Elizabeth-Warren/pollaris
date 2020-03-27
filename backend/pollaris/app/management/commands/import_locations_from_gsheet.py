import logging
from collections import defaultdict
from json import loads

import pygsheets
from django.core.management.base import BaseCommand
from google.oauth2.credentials import Credentials

from ew_common import ssm
from pollaris.app.management.commands.state_config import STATE_IMPORT_MAP
from pollaris.app.models import *
from pollaris.app.views.utils import VoteType, get_join_model, get_location_model

# Usage example: pipenv run python manage.py import_locations_from_gsheet IA


class Command(BaseCommand):
    help = "Load polling location data from a spreadsheet"

    def add_arguments(self, parser):
        parser.add_argument("import_code")

    def handle(self, *args, **options):
        import_code = options["import_code"]
        state_info = STATE_IMPORT_MAP.get(import_code)
        if not state_info:
            raise Exception(f"No mapping found for import code {import_code}")

        ingestor = StatePollingLocationIngestor(import_code, state_info)
        ingestor.run_import()


class StatePollingLocationIngestor:
    def __init__(self, import_code, state_info):
        self.import_code = import_code
        self.state_code = state_info.state_code
        self.state_info = state_info
        self.fields = self.state_info.field_mapping
        self.stats = defaultdict(int)
        self.changes = defaultdict(int)
        self.errors = []

    def get_sheets_client(self):
        credentials = ssm.get("/shared/google/hedwig/credentials.json")
        if not credentials:
            raise Exception("Got NULL for Google Credentials")

        try:
            return pygsheets.client.Client(
                Credentials.from_authorized_user_info(loads(credentials))
            )
        except Exception as e:
            logging.exception("Failed getting credentials from authorized user info")

    def run_import(self):
        print("Starting import script for", self.import_code)
        client = self.get_sheets_client()
        sheet = client.open_by_key(self.state_info.gsheet_id)
        worksheet = sheet.worksheet("id", self.state_info.worksheet_id)
        if worksheet is None:
            raise Exception("Failed finding worksheet")

        count = 0
        all_rows = worksheet.get_all_records(
            head=self.state_info.header_row, numericise_data=False
        )
        logging.info(f"Num rows: {len(all_rows)}")
        for row in all_rows:
            count += 1
            if count % 100 == 0:
                print(count)

            try:
                if self.state_info.is_override:
                    self.import_override_row(row)
                else:
                    self.import_row(row)
            except Exception as e:
                logging.exception(e)
                error = {"exception": e, "row": row}
                self.errors.append(error)
                logging.exception(e)

        if len(all_rows) > 0:
            print("Stats:", dict(self.stats))
            print("Changes:", dict(self.changes))
            print("Errors:", self.errors)
            print(f"Error count: {len(self.errors)}")

    def is_valid(self, row):
        """Whether this is a valid row that we should import"""
        return True

    def import_row(self, row):
        self.stats["total_rows"] += 1

        # Create/update precinct
        van_precinct_id = row.get(self.fields.van_precinct_id)
        precinct = Precinct(
            van_precinct_id=van_precinct_id,
            precinct_code=row.get(self.fields.precinct_code, ""),
            state_code=self.state_code,
            county=row.get(self.fields.county, ""),
            fips=row.get(self.fields.fips, ""),
        )
        precinct.clean_fields()  # Runs validation rules from model definition
        precinct.save()

        location_model = get_location_model(self.state_info.vote_type)
        join_model = get_join_model(self.state_info.vote_type)

        # Delete any invalid PollingLocations
        if not self.is_valid(row):
            self.stats["rows_skipped"] += 1
            try:
                polling_location = location_model.objects.get(
                    location_id=van_precinct_id
                )
                print("Deleting:", polling_location)
                polling_location.delete()
                self.stats["polling_locations_deleted"] += 1
            except location_model.DoesNotExist:
                pass

            return

        # Create/update PollingLocations and track changes
        # If there's no location ID, assume one precinct maps to one polling location and use precinct ID as location ID
        # TODO: If multiple states have the same range of locationIDs, how do we avoid conflicts?
        if self.fields.location_id:
            location_id = row.get(self.fields.location_id)
        else:
            location_id = van_precinct_id

        zip_string = str(row.get(self.fields.zip))
        if zip_string:
            zip5 = zip_string.zfill(5)
        else:
            # TODO this will fail validation, consider allowing blank zips if needed
            zip5 = ""

        pl, created = location_model.objects.get_or_create(location_id=location_id)
        pl.location_name = row.get(self.fields.location_name)
        pl.address = row.get(self.fields.street_address)
        pl.city = row.get(self.fields.city)
        pl.state_code = self.state_code
        pl.zip = zip5
        pl.dates_hours = row.get(self.fields.dates_hours)
        pl.latitude = row.get(self.fields.latitude) or None
        pl.longitude = row.get(self.fields.longitude) or None
        pl.clean_fields()

        changed = pl.tracker.changed()
        if created:
            print("Created:", pl)
            self.stats["rows_created"] += 1
        elif changed:
            print(f"Changed: {pl}; Old fields: {changed}")
            self.stats["rows_changed"] += 1
            for key in changed:
                self.changes[key] += 1
        else:
            self.stats["rows_unchanged"] += 1
        pl.save()

        # Create or update PrecinctToPollingLocations
        ptpl, created = join_model.objects.get_or_create(
            precinct=precinct, state_code=self.state_code, distance=1.0, location=pl
        )
        ptpl.clean_fields()
        ptpl.save()
        self.stats["rows_complete"] += 1

    def import_override_row(self, row):
        """Override rows must override an existing row rather than create a new one. They only edit
        PollingLocation/EarlyVoteLocation, not Precinct or PrecinctToPollingLocation """
        self.stats["total_rows"] += 1

        location_id = row.get(self.fields.location_id)
        precinct_id = row.get(self.fields.van_precinct_id)

        # If there's a specific location ID given, use that to identify the location.
        # Otherwise, find location by precinct ID (assumes there's one location per precinct)
        if location_id:
            location_model = get_location_model(self.state_info.vote_type)
            pl = location_model.objects.get(location_id=location_id)
        elif self.state_info.vote_type == VoteType.REGULAR_VOTE:
            ptpl = PrecinctToPollingLocation.objects.get(precinct_id=precinct_id)
            pl = ptpl.location
        else:
            raise Exception("Cannot identify early vote location without location ID")

        # Create/update locations and track changes
        pl.location_name = row.get(self.fields.location_name)
        pl.address = row.get(self.fields.street_address)
        pl.city = row.get(self.fields.city)
        pl.state_code = self.state_code
        pl.zip = row.get(self.fields.zip)
        pl.latitude = row.get(self.fields.latitude) or None
        pl.longitude = row.get(self.fields.longitude) or None
        date_hours = row.get(self.fields.dates_hours)
        if date_hours:  # Don't overwrite dates/hours if it's not given in spreadsheet
            pl.dates_hours = date_hours
        pl.clean_fields()

        changed = pl.tracker.changed()
        if changed:
            print(f"Changed for precinct {precinct_id}: {pl}; Old fields: {changed}")
            self.stats["rows_changed"] += 1
            for key in changed:
                self.changes[key] += 1
        else:
            self.stats["rows_unchanged"] += 1
        pl.save()

        self.stats["rows_complete"] += 1
