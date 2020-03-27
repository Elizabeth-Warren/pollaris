import copy
import json
import pprint
import urllib

import pytest
import responses
from django.test import Client

BSD_PROXY_URL = "https://bsd-signup-proxy"

FORM_REQUEST_IA = {
    # This comes from inspecting the form submission in Chrome and
    # choosing "Copy as cURL".
    "form": "firstname=Jason&lastname=Katz-Brown&email=example%40example.com&phone=5105551234&addr1=1140%20Vividell%20Ln&city=West%20Des%20Moines&state_cd=IA&zip=50266&custom-16069=50266&custom-16063=947770&custom-16067=West%20Des%20Moines&custom-16065=Monday%2C%20February%203%2C%202020.%20The%20caucus%20starts%20at%207pm%2C%20but%20we%20recommend%20you%20arrive%20at%206%3A30pm.&custom-16068=IA&custom-16064=Valley%20High%20School%20-%20Cafeteria&custom-16066=3650%20Woodland%20Ave&custom-16616=en-US"
}

FORM_REQUEST_NH = {
    "form": "firstname=Jason&lastname=Katz-Brown&email=example%40example.com&phone=5105551234&addr1=6%20Sunrise%20Trail&city=Nashua&state_cd=NH&zip=03062&custom-16069=03062&custom-16063=972394&custom-16067=Nashua&custom-16065=6:00%20AM%20-%208:00%20PM&custom-16068=NH&custom-16064=MAIN%20DUNSTABLE%20ELEMENTARY%20SCHOOL&custom-16066=20%20Whitford%20Road&custom-16616=en-US"
}

FORM_REQUEST_NV_EARLY_VOTE = {
    "form": "firstname=Jason&lastname=Katz-Brown&email=example%40example.com&phone=5105551234&addr1=6%20California%20Way&city=Henderson&state_cd=NV&zip=89015&custom-16616=en-US&custom-16069=89015&custom-16063=9139047815396910000&custom-17132=https%3A%2F%2Fexample.com%2Fvote%3Fid%3DChIJaVLWwrvWyIARxS_ve7bmrgY&custom-17131=early_vote_locations&custom-16067=Henderson&custom-16065=Sa%202%2F15%2010AM%20-%206PM%2C%20Su%202%2F16%201PM%20-%205PM%2C%20Mo%202%2F17%2010AM%20-%206PM%2C%20Tu%202%2F18%208AM%20-%208PM&custom-16068=NV&custom-16064=Steelworkers%20Local%204856&custom-16066=47%20S%20Water%20Street&custom-17240=9139047815396910000"
}

FORM_REQUEST_NV_CAUCUS = {
    "form": "firstname=Jason&lastname=Katz-Brown&email=example%40example.com&phone=5105551234&addr1=6%20California%20Way&city=Henderson&state_cd=NV&zip=89015&custom-16616=en-US&custom-16069=89015&custom-16063=3937382232689271000&custom-17132=https%3A%2F%2Fexample.com%2Fvote%3Fid%3DChIJaVLWwrvWyIARxS_ve7bmrgY%26streetNumber%3D6&custom-17131=polling_locations&custom-16067=HENDERSON&custom-16065=Caucus%20Registration%20Opens%20at%2010AM%2C%20Registration%20Closes%20at%2012PM&custom-16068=NV&custom-16064=Caucus%20Day%20Location%20-%20LYAL%20BURKHOLDER%20MIDDLE%20SCHOOL&custom-16066=355%20W%20VAN%20WAGENEN%20ST&custom-17240=3937382232689271000"
}

FORM_REQUEST_CA_VOTE_BY_MAIL = {
    "form": "firstname=Jason&lastname=Katz-Brown&email=example%40example.com&phone=5105551234&addr1=20%20Belvedere%20Ave&city=Richmond&state_cd=CA&zip=94801&custom-16616=en-US&custom-17132=https%3A%2F%2Fwarrenreports-staging-pr-704.herokuapp.com%2Fvote%3Fid%3DChIJB9p2QsSChYARaTB0k8y-N8Y%26streetNumber%3D20&custom-17131=vote_by_mail&custom-18207=warrenreports-staging-pr-704.herokuapp.com%2Fvote%2Fcalifornia&custom-17816=14822091002910517536"
}

MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_IA = {
    "phone_number": "15105551234",
    "email": "example@example.com",
    "postal_code": "50266",
    "first_name": "Jason",
    "last_name": "Katz-Brown",
    "street1": "1140 Vividell Ln",
    "city": "West Des Moines",
    "state": "IA",
    "country": "US",
    "polling_location_name": "Valley High School - Cafeteria",
    "polling_address": "3650 Woodland Ave",
    "polling_city": "West Des Moines",
    "polling_state": "IA",
    "polling_zip": "50266",
    "polling_time": "Monday, February 3, 2020. The caucus starts at 7pm, but we recommend you arrive at 6:30pm.",
    "polling_precinct_id": "947770",
    "opt_in_path_id": 290677,
}

MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_NH = {
    "phone_number": "15105551234",
    "email": "example@example.com",
    "postal_code": "03062",
    "first_name": "Jason",
    "last_name": "Katz-Brown",
    "street1": "6 Sunrise Trail",
    "city": "Nashua",
    "state": "NH",
    "country": "US",
    "polling_location_name": "MAIN DUNSTABLE ELEMENTARY SCHOOL",
    "polling_address": "20 Whitford Road",
    "polling_city": "Nashua",
    "polling_state": "NH",
    "polling_zip": "03062",
    "polling_time": "6:00 AM - 8:00 PM",
    "polling_precinct_id": "972394",
    "opt_in_path_id": 291258,
}

MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_NV_EARLY_VOTE = {
    "city": "Henderson",
    "country": "US",
    "email": "example@example.com",
    "first_name": "Jason",
    "last_name": "Katz-Brown",
    "opt_in_path_id": 292302,
    "phone_number": "15105551234",
    "polling_address": "47 S Water Street",
    "polling_city": "Henderson",
    "polling_location_name": "Steelworkers Local 4856",
    "polling_precinct_id": "9139047815396910000",
    "polling_state": "NV",
    "polling_time": "Sa 2/15 10AM - 6PM, Su 2/16 1PM - 5PM, Mo 2/17 10AM - 6PM, "
    "Tu 2/18 8AM - 8PM",
    "polling_zip": "89015",
    "postal_code": "89015",
    "state": "NV",
    "street1": "6 California Way",
}

MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_NV_CAUCUS = {
    "city": "Henderson",
    "country": "US",
    "email": "example@example.com",
    "first_name": "Jason",
    "last_name": "Katz-Brown",
    "opt_in_path_id": 292305,
    "phone_number": "15105551234",
    "polling_address": "355 W VAN WAGENEN ST",
    "polling_city": "HENDERSON",
    "polling_location_name": "Caucus Day Location - LYAL BURKHOLDER MIDDLE SCHOOL",
    "polling_precinct_id": "3937382232689271000",
    "polling_state": "NV",
    "polling_time": "Caucus Registration Opens at 10AM, Registration Closes at 12PM",
    "polling_zip": "89015",
    "postal_code": "89015",
    "state": "NV",
    "street1": "6 California Way",
}

MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_CA_VOTE_BY_MAIL = {
    "city": "Richmond",
    "country": "US",
    "email": "example@example.com",
    "first_name": "Jason",
    "last_name": "Katz-Brown",
    "opt_in_path_id": 294243,
    "phone_number": "15105551234",
    "postal_code": "94801",
    "state": "CA",
    "street1": "20 Belvedere Ave",
}

MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_IA = {
    "campaign_id": 189358,
    "phone_number": "15105551234",
    "body": "Your caucus location:\nValley High School - Cafeteria\n3650 Woodland Ave\nWest Des Moines, IA 50266\nMonday, February 3, 2020. The caucus starts at 7pm, but we recommend you arrive at 6:30pm.",
}

MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_NH = {
    "campaign_id": 189358,
    "phone_number": "15105551234",
    "body": "Your polling location:\nMAIN DUNSTABLE ELEMENTARY SCHOOL\n20 Whitford Road\nNashua, NH 03062\n6:00 AM - 8:00 PM",
}

MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_NV_EARLY_VOTE = {
    "body": "Your early vote location:\n"
    "Steelworkers Local 4856\n"
    "47 S Water Street\n"
    "Henderson, NV 89015\n"
    "Sa 2/15 10AM - 6PM, Su 2/16 1PM - 5PM, Mo 2/17 10AM - 6PM, Tu 2/18 "
    "8AM - 8PM",
    "campaign_id": 189358,
    "phone_number": "15105551234",
}

MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_NV_EARLY_VOTE_ES = {
    "body": "Tu localizacion de votacion temprana:\n"
    "Steelworkers Local 4856\n"
    "47 S Water Street\n"
    "Henderson, NV 89015\n"
    "Sa 2/15 10AM - 6PM, Su 2/16 1PM - 5PM, Mo 2/17 10AM - 6PM, Tu 2/18 "
    "8AM - 8PM",
    "campaign_id": 189358,
    "phone_number": "15105551234",
}

MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_NV_CAUCUS = {
    "body": "Your caucus location:\n"
    "Caucus Day Location - LYAL BURKHOLDER MIDDLE SCHOOL\n"
    "355 W VAN WAGENEN ST\n"
    "HENDERSON, NV 89015\n"
    "Caucus Registration Opens at 10AM, Registration Closes at 12PM",
    "campaign_id": 189358,
    "phone_number": "15105551234",
}

MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_CA_VOTE_BY_MAIL = {
    "body": "Learn more about how to vote: "
    "warrenreports-staging-pr-704.herokuapp.com/vote/california",
    "campaign_id": 189358,
    "phone_number": "15105551234",
}

SES_SEND_EMAIL_ARGUMENTS_GOLDEN_IA = {
    "template_name": "voting_location_IA",
    "from_email": "Iowa for Warren <iowa@mail.elizabethwarren.com>",
    "recipient": "example@example.com",
    "reply_to_email": "Iowa for Warren <iowa@elizabethwarren.com>",
    "configuration_set_name": "organizing_emails",
    "payload": {
        "addr1": "1140 Vividell Ln",
        "city": "West Des Moines",
        "dropbox_locations": False,
        "early_vote_locations": False,
        "email": "example@example.com",
        "firstname": "Jason",
        "language": "en-US",
        "lastname": "Katz-Brown",
        "vote_by_mail": False,
        "name_of_location": "Valley High School - Cafeteria",
        "phone": "5105551234",
        "polling_address": "3650 Woodland Ave",
        "polling_city": "West Des Moines",
        "polling_locations": True,
        "polling_state": "IA",
        "polling_zip": "50266",
        "preferred_voting_type": "polling_locations",
        "state_cd": "IA",
        "time_of_event": "Monday, February 3, 2020. The caucus starts at "
        "7pm, but we recommend you arrive at 6:30pm.",
        "transactional": True,
        "van_precinct_id": "947770",
        "zip": "50266",
    },
    "application_name": "pollaris",
}

SES_SEND_EMAIL_ARGUMENTS_GOLDEN_NH = {
    "template_name": "voting_location_generic",
    "from_email": "New Hampshire for Warren <newhampshire@mail.elizabethwarren.com>",
    "recipient": "example@example.com",
    "reply_to_email": "New Hampshire for Warren <newhampshire@elizabethwarren.com>",
    "configuration_set_name": "organizing_emails",
    "payload": {
        "addr1": "6 Sunrise Trail",
        "city": "Nashua",
        "dropbox_locations": False,
        "early_vote_locations": False,
        "email": "example@example.com",
        "firstname": "Jason",
        "language": "en-US",
        "lastname": "Katz-Brown",
        "vote_by_mail": False,
        "name_of_location": "MAIN DUNSTABLE ELEMENTARY SCHOOL",
        "phone": "5105551234",
        "polling_address": "20 Whitford Road",
        "polling_city": "Nashua",
        "polling_locations": True,
        "polling_state": "NH",
        "polling_zip": "03062",
        "preferred_voting_type": "polling_locations",
        "state_cd": "NH",
        "time_of_event": "6:00 AM - 8:00 PM",
        "transactional": True,
        "van_precinct_id": "972394",
        "zip": "03062",
    },
    "application_name": "pollaris",
}

SES_SEND_EMAIL_ARGUMENTS_GOLDEN_NV_EARLY_VOTE = {
    "application_name": "pollaris",
    "configuration_set_name": "organizing_emails",
    "from_email": "Nevada for Warren <nevada@mail.elizabethwarren.com>",
    "payload": {
        "addr1": "6 California Way",
        "city": "Henderson",
        "dropbox_locations": False,
        "early_vote_locations": True,
        "email": "example@example.com",
        "firstname": "Jason",
        "language": "en-US",
        "lastname": "Katz-Brown",
        "vote_by_mail": False,
        "name_of_location": "Steelworkers Local 4856",
        "phone": "5105551234",
        "pollaris_search_id": "9139047815396910000",
        "polling_address": "47 S Water Street",
        "polling_city": "Henderson",
        "polling_locations": False,
        "polling_state": "NV",
        "polling_zip": "89015",
        "preferred_voting_type": "early_vote_locations",
        "results_url": "https://example.com/vote?id=ChIJaVLWwrvWyIARxS_ve7bmrgY",
        "state_cd": "NV",
        "time_of_event": "Sa 2/15 10AM - 6PM, Su 2/16 1PM - 5PM, Mo 2/17 "
        "10AM - 6PM, Tu 2/18 8AM - 8PM",
        "transactional": True,
        "van_precinct_id": "9139047815396910000",
        "zip": "89015",
    },
    "recipient": "example@example.com",
    "reply_to_email": "Nevada for Warren <nevada@elizabethwarren.com>",
    "template_name": "voting_location_NV",
}

SES_SEND_EMAIL_ARGUMENTS_GOLDEN_NV_CAUCUS = {
    "application_name": "pollaris",
    "configuration_set_name": "organizing_emails",
    "from_email": "Nevada for Warren <nevada@mail.elizabethwarren.com>",
    "payload": {
        "addr1": "6 California Way",
        "city": "Henderson",
        "dropbox_locations": False,
        "early_vote_locations": False,
        "email": "example@example.com",
        "firstname": "Jason",
        "language": "en-US",
        "lastname": "Katz-Brown",
        "vote_by_mail": False,
        "name_of_location": "Caucus Day Location - LYAL BURKHOLDER MIDDLE SCHOOL",
        "phone": "5105551234",
        "pollaris_search_id": "3937382232689271000",
        "polling_address": "355 W VAN WAGENEN ST",
        "polling_city": "HENDERSON",
        "polling_locations": True,
        "polling_state": "NV",
        "polling_zip": "89015",
        "preferred_voting_type": "polling_locations",
        "results_url": "https://example.com/vote?id=ChIJaVLWwrvWyIARxS_ve7bmrgY&streetNumber=6",
        "state_cd": "NV",
        "time_of_event": "Caucus Registration Opens at 10AM, Registration "
        "Closes at 12PM",
        "transactional": True,
        "van_precinct_id": "3937382232689271000",
        "zip": "89015",
    },
    "recipient": "example@example.com",
    "reply_to_email": "Nevada for Warren <nevada@elizabethwarren.com>",
    "template_name": "voting_location_NV",
}

SES_SEND_EMAIL_ARGUMENTS_GOLDEN_CA_VOTE_BY_MAIL = {
    "application_name": "pollaris",
    "configuration_set_name": "organizing_emails",
    "from_email": "ElizabethWarren.com <info@mail.elizabethwarren.com>",
    "payload": {
        "addr1": "20 Belvedere Ave",
        "city": "Richmond",
        "custom-17816": "14822091002910517536",
        "dropbox_locations": False,
        "early_vote_locations": False,
        "email": "example@example.com",
        "firstname": "Jason",
        "language": "en-US",
        "lastname": "Katz-Brown",
        "phone": "5105551234",
        "polling_locations": False,
        "preferred_voting_type": "vote_by_mail",
        "results_url": "https://warrenreports-staging-pr-704.herokuapp.com/vote?id=ChIJB9p2QsSChYARaTB0k8y-N8Y&streetNumber=20",
        "state_cd": "CA",
        "transactional": True,
        "vote_by_mail": True,
        "voter_education_url": "warrenreports-staging-pr-704.herokuapp.com/vote/california",
        "zip": "94801",
    },
    "recipient": "example@example.com",
    "reply_to_email": "ElizabethWarren.com <info@elizabethwarren.com>",
    "template_name": "voting_location_generic",
}

BSD_PROXY_SUBMIT_RESPONSE = {
    "statusCode": 202,
    "body": '{"api_version":1,"status":"success","thanks_url":"https:\\/\\/my.elizabethwarren.com\\/page\\/st\\/web-poll-tool?action_code=FgxRWxYUOVIKQV0YAFUHUU4J&td=VZHLTsMwEEV_JcqWprKTtCVZUakIsUBC4rVAyHLsSWvJsSM_ilrEvzMmhUJWnnNHc-9kPnJhownukLf500M-y2HgSmOxl8rzd-4uAvhwBVodeQdhh8SBmQs7YG-vnA-GD4D9z8rvuEao-S_bTCMQcikdRVLSJrvObhw3MlvvARWhQvLegM_urDLgkfnA...',
}

MOBILE_COMMONS_PROFILE_UPDATE_RESPONSE = """
<response success="true">
  <profile id="345304097">
    <first_name>Jason</first_name>
    <last_name>Katz-Brown</last_name>
    <phone_number>15105551234</phone_number>
  </profile>
</response>
"""

MOBILE_COMMONS_SEND_MESSAGE_RESPONSE = """
<response success="true">
<message id="6755704007" type="generic" status="queued">
  <phone_number>15105551234</phone_number>
  <profile>338948442</profile>
  <body>Your location...</body>
  <sent_at>2019-05-31 05:04:17 UTC</sent_at>
  <message_template_id/>
  <campaign id="189358" active="true">
    <name>National</name>
  </campaign>
</message>
</response>
"""


@responses.activate
def test_after_search_bad_request(mocker):
    responses.add(
        responses.POST,
        BSD_PROXY_URL,
        json=BSD_PROXY_SUBMIT_RESPONSE,
    )

    invalid_request = {
        "form": "firstname=Jason&lastname=Katz-Brown&email=example%40example.com"
    }
    email_service_mock = mocker.patch("pollaris.app.views.side_effects.EmailService")
    resp = Client().post(
        "/api/v1/forms/after_search", invalid_request, content_type="application/json"
    )

    assert resp.status_code == 400
    assert resp.json()["error_message"].startswith("Form data doesn't include state_cd")


@responses.activate
def test_after_search_mobile_commons_failure(mocker):
    responses.add(
        responses.POST,
        BSD_PROXY_URL,
        json=BSD_PROXY_SUBMIT_RESPONSE,
    )

    email_service_mock = mocker.patch("pollaris.app.views.side_effects.EmailService")
    resp = Client().post(
        "/api/v1/forms/after_search", FORM_REQUEST_IA, content_type="application/json"
    )

    # We won't mock Mobile Commons, so it'll raise an exception.

    assert resp.status_code == 400
    assert resp.json()["error_message"] == "Failure in sending voting location SMS"


@responses.activate
def test_after_search_ia(mocker):
    run_generic_test(
        mocker,
        FORM_REQUEST_IA,
        MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_IA,
        MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_IA,
        SES_SEND_EMAIL_ARGUMENTS_GOLDEN_IA,
    )


@responses.activate
def test_after_search_nh(mocker):
    run_generic_test(
        mocker,
        FORM_REQUEST_NH,
        MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_NH,
        MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_NH,
        SES_SEND_EMAIL_ARGUMENTS_GOLDEN_NH,
    )


@responses.activate
def test_after_search_nv_early_vote(mocker):
    run_generic_test(
        mocker,
        FORM_REQUEST_NV_EARLY_VOTE,
        MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_NV_EARLY_VOTE,
        MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_NV_EARLY_VOTE,
        SES_SEND_EMAIL_ARGUMENTS_GOLDEN_NV_EARLY_VOTE,
    )


@responses.activate
def test_after_search_nv_caucus(mocker):
    run_generic_test(
        mocker,
        FORM_REQUEST_NV_CAUCUS,
        MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_NV_CAUCUS,
        MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_NV_CAUCUS,
        SES_SEND_EMAIL_ARGUMENTS_GOLDEN_NV_CAUCUS,
    )


@responses.activate
def test_after_search_ca_vote_by_mail(mocker):
    run_generic_test(
        mocker,
        FORM_REQUEST_CA_VOTE_BY_MAIL,
        MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_CA_VOTE_BY_MAIL,
        MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_CA_VOTE_BY_MAIL,
        SES_SEND_EMAIL_ARGUMENTS_GOLDEN_CA_VOTE_BY_MAIL,
    )


@responses.activate
def test_after_search_nv_early_vote_es(mocker):
    form_request_es = FORM_REQUEST_NV_EARLY_VOTE.copy()
    form_request_es["form"] = urllib.parse.urlencode(
        [
            x
            for x in urllib.parse.parse_qsl(form_request_es["form"])
            if x[0] != "custom-16616"
        ]
        + [("custom-16616", "es-MX")]
    )

    ses_send_email_arguments_es = copy.deepcopy(
        SES_SEND_EMAIL_ARGUMENTS_GOLDEN_NV_EARLY_VOTE
    )
    ses_send_email_arguments_es["payload"]["language"] = "es-MX"
    ses_send_email_arguments_es["template_name"] = "voting_location_NV_es"
    ses_send_email_arguments_es[
        "from_email"
    ] = "Nevada por Warren <nevada@mail.elizabethwarren.com>"
    ses_send_email_arguments_es[
        "from_email"
    ] = "Nevada por Warren <nevada@mail.elizabethwarren.com>"
    ses_send_email_arguments_es[
        "reply_to_email"
    ] = "Nevada por Warren <nevada@elizabethwarren.com>"
    run_generic_test(
        mocker,
        form_request_es,
        MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_NV_EARLY_VOTE,
        MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_NV_EARLY_VOTE_ES,
        ses_send_email_arguments_es,
    )


@responses.activate
def test_after_search_no_phone(mocker):
    form_request_no_phone = FORM_REQUEST_IA.copy()
    form_request_no_phone["form"] = urllib.parse.urlencode(
        [
            x
            for x in urllib.parse.parse_qsl(form_request_no_phone["form"])
            if x[0] != "phone"
        ]
    )

    ses_send_email_arguments_no_phone = copy.deepcopy(
        SES_SEND_EMAIL_ARGUMENTS_GOLDEN_IA
    )
    del ses_send_email_arguments_no_phone["payload"]["phone"]

    run_generic_test(
        mocker, form_request_no_phone, None, None, ses_send_email_arguments_no_phone
    )


@responses.activate
def test_after_search_draft_email(mocker):
    """Same as IA caucus location lookup, but with email address with +draftdraftdraft.

    This triggers mail using template with '_draft' suffix, i.e.
    'voting_location_IA_draft' mailing template.
    """
    draft_email = "example+draftdraftdraft@example.com"
    form_request_draft_email = FORM_REQUEST_IA.copy()
    form_request_draft_email["form"] = urllib.parse.urlencode(
        [
            x
            for x in urllib.parse.parse_qsl(form_request_draft_email["form"])
            if x[0] != "email"
        ]
        + [("email", draft_email)]
    )

    mobile_commons_profile_update_draft_email = (
        MOBILE_COMMONS_PROFILE_UPDATE_GOLDEN_IA.copy()
    )
    mobile_commons_profile_update_draft_email[
        "email"
    ] = "example+draftdraftdraft@example.com"

    ses_send_email_arguments_draft_email = copy.deepcopy(
        SES_SEND_EMAIL_ARGUMENTS_GOLDEN_IA
    )
    ses_send_email_arguments_draft_email["recipient"] = draft_email
    ses_send_email_arguments_draft_email["payload"]["email"] = draft_email
    ses_send_email_arguments_draft_email["template_name"] = "voting_location_IA_draft"

    run_generic_test(
        mocker,
        form_request_draft_email,
        mobile_commons_profile_update_draft_email,
        MOBILE_COMMONS_SEND_MESSAGE_GOLDEN_IA,
        ses_send_email_arguments_draft_email,
    )


def run_generic_test(
    mocker,
    form_request_base,
    mobile_commons_profile_update_golden,
    mobile_commons_send_message_golden,
    ses_send_email_arguments_golden,
):
    form_request = form_request_base.copy()

    def check_bsd_submission_request_body(request):
        body = json.loads(request.body)
        print("Got BSD request body:")
        pprint.pprint(body)
        assert body == form_request
        return (200, {}, json.dumps(BSD_PROXY_SUBMIT_RESPONSE))

    responses.add_callback(
        responses.POST,
        BSD_PROXY_URL,
        callback=check_bsd_submission_request_body,
        match_querystring=True,
    )

    if mobile_commons_profile_update_golden:

        def check_mobile_commons_update_profile_request_body(request):
            body = json.loads(request.body)
            print("Got Mobile Commons update profile request:")
            pprint.pprint(body)
            expected = mobile_commons_profile_update_golden
            for k, v in expected.items():
                assert body[k] == v
            return (200, {}, MOBILE_COMMONS_PROFILE_UPDATE_RESPONSE)

        responses.add_callback(
            responses.POST,
            "https://secure.mcommons.com/api/profile_update",
            callback=check_mobile_commons_update_profile_request_body,
            match_querystring=True,
        )

    if mobile_commons_send_message_golden:

        def check_mobile_commons_send_message_request_body(request):
            body = json.loads(request.body)
            print("Got Mobile Commons send message request:")
            pprint.pprint(body)
            expected = mobile_commons_send_message_golden
            for k, v in expected.items():
                assert body[k] == v
            return (200, {}, MOBILE_COMMONS_SEND_MESSAGE_RESPONSE)

        responses.add_callback(
            responses.POST,
            "https://secure.mcommons.com/api/send_message",
            callback=check_mobile_commons_send_message_request_body,
            match_querystring=True,
        )

    email_service_mock = mocker.patch("pollaris.app.views.side_effects.EmailService")
    resp = Client().post(
        "/api/v1/forms/after_search", form_request, content_type="application/json"
    )

    assert resp.status_code == 200
    assert resp.json()["status"] == "success"

    email_service_mock.return_value.send_email.assert_called_once_with(
        **ses_send_email_arguments_golden
    )

    # Try again in an unknown language; make sure English still sends

    form_request["custom-16616"] = "ja-JP"

    resp = Client().post(
        "/api/v1/forms/after_search", form_request, content_type="application/json"
    )

    assert resp.status_code == 200
    assert resp.json()["status"] == "success"

    # TODO(Jason Katz-Brown): Spanish-language test when that is done
