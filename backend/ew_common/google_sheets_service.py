# get things from the master sheet to update the prio doc
# TAB_NAME: Source of Truth
# COLUMNS required: state_code, sheet

# get things from the db to update the prioritization
# TAB_NAME: Prioritizations
# COLUMNS required: event_id, pritoization

# write a last updated back to the doc
# TAB_NAME: Last Updated
# COLUMNS required: last_updated, errors

import pygsheets
from google.oauth2.credentials import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


class GoogleSheetsClient:
    client = None

    def __init__(self, credentials):
        self.client = self.__get_sheets_client(credentials)

    def __get_sheets_client(self, json_credentials):
        credentials = Credentials.from_authorized_user_info(
            json_credentials, scopes=SCOPES
        )
        return pygsheets.client.Client(credentials)

    def __get_worksheet(self, url, tab_name):
        spreadsheet = self.client.open_by_url(url)
        worksheet = spreadsheet.worksheet_by_title(tab_name)
        return worksheet

    def get_values_from_sheet(self, url, tab_name, columns=[], header_rows=1):
        """ Gets the values from a sheet at the given url/tab name
            Can specify the columns to filter and get back.
            Returns a dictionary like [{"column1": value, "column2": value}, {"column1": value...}]
        """
        record_dictionaries = self.__get_worksheet(url, tab_name).get_all_records(
            head=header_rows
        )
        if len(columns) == 0:
            return record_dictionaries
        # maybe use a fancy yield here. THAT SEEMS COOL
        return [
            {k: v for k, v in row_dictionary.items() if k in columns}
            for row_dictionary in record_dictionaries
        ]
