# pylint: skip-file
#
# We use this to run the expire handler
#

import pollaris.wsgi  # isort:skip
from django.core import management  # isort:skip

IMPORT_CODES = []


def handle(event, context):
    for import_code in IMPORT_CODES:
        management.call_command("import_locations_from_gsheet", import_code)


if __name__ == "__main__":
    handle(None, None)
