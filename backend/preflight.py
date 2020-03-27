#!/usr/bin/env python

# pylint: skip-file
#
# We use this to run any preflight logic
#

import pollaris.wsgi  # isort:skip
from django.core import management  # isort:skip


def handle(event, context):
    management.call_command("migrate")


if __name__ == "__main__":
    handle(None, None)
