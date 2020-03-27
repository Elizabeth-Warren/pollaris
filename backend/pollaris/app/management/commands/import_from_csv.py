import csv

from django.core.management.base import BaseCommand

from ...models import *

# Usage example: python manage.py import_from_csv IA "<filename.csv>"


class Command(BaseCommand):
    help = "Load polling location data from a spreadsheet"

    def add_arguments(self, parser):
        parser.add_argument("state_code")
        parser.add_argument("file")

    def handle(self, *args, **options):
        state_code = options["state_code"]
        file_name = options["file"]
        lid = 1
        reader = csv.DictReader(open(file_name))
        for row in reader:
            print(row)
            precinct, created = Precinct.objects.get_or_create(
                van_precinct_id=row.get("Precinct ID"),
                state_code=state_code,
                county=row.get("County"),
                precinct_code=row.get("Precinct Code"),
            )
            precinct.save()

            polling_location = PollingLocation(
                location_id=lid,
                location_name=row.get("Location Name"),
                address=row.get("Street Address"),
                city=row.get("City"),
                state_code=state_code,
                zip=row.get("Zip Code"),
            )
            polling_location.save()

            ptpl = PrecinctToPollingLocation(
                precinct=precinct,
                state_code=state_code,
                distance=1.0,
                location=polling_location,
            )
            ptpl.save()
            lid += 1
