import json
import logging
import pprint
import urllib

import requests
from django.conf import settings
from django.http import JsonResponse
from jinja2 import Template

from ew_common.email_service import EmailService
from ew_common.input_validation import extract_phone_number, normalize_name
from ew_common.mobile_commons import create_or_update_mobile_commons_profile, send_sms
from pollaris.app.views.utils import SearchStatus, bad_request

DEFAULT_LANGUAGE = "en-US"

# URL for sending
BSD_WEB_POLL_TOOL_SUBMIT_URL = (
    "https://bsd-signup-proxy"
)
BSD_SUBMIT_HEADERS = {"Origin": "https://elizabethwarren.com"}

VOTING_TYPE_EARLY_VOTE = "early_vote_locations"
VOTING_TYPE_DAY_OF = "polling_locations"
VOTING_TYPE_DROPBOX_LOCATIONS = "dropbox_locations"
VOTING_TYPE_MAIL = "vote_by_mail"
VOTING_TYPES = [
    VOTING_TYPE_EARLY_VOTE,
    VOTING_TYPE_DAY_OF,
    VOTING_TYPE_DROPBOX_LOCATIONS,
    VOTING_TYPE_MAIL,
]

# If recipient email address has +draftdraftdraft in it, we'll append
# '_draft' to the mailing template name.
VOTING_LOCATION_MAILING_RECIPIENT_DRAFT_SUFFIX = "+draftdraftdraft"
VOTING_LOCATION_MAILING_TEMPLATE_DRAFT_SUFFIX = "_draft"

VOTING_LOCATION_MAILING_CONFIGURATION_SET_NAME = "organizing_emails"
VOTING_LOCATION_MAILING_APPLICATION_NAME = "pollaris"
VOTING_LOCATION_MAILING_BY_LANGUAGE_STATE = {
    # These templates are editable in our Contentful Emails space
    "en-US": {
        "IA": {
            "template_name": "voting_location_IA",
            "from_email": "Iowa for Warren <iowa@mail.elizabethwarren.com>",
            "reply_to_email": "Iowa for Warren <iowa@elizabethwarren.com>",
        },
        "NH": {
            "template_name": "voting_location_generic",
            "from_email": "New Hampshire for Warren <newhampshire@mail.elizabethwarren.com>",
            "reply_to_email": "New Hampshire for Warren <newhampshire@elizabethwarren.com>",
        },
        "NV": {
            # NV has early vote and day-of caucuses, so it needs its own
            # template.
            "template_name": "voting_location_NV",
            "from_email": "Nevada for Warren <nevada@mail.elizabethwarren.com>",
            "reply_to_email": "Nevada for Warren <nevada@elizabethwarren.com>",
        },
        "default": {
            "template_name": "voting_location_generic",
            "from_email": "ElizabethWarren.com <info@mail.elizabethwarren.com>",
            "reply_to_email": "ElizabethWarren.com <info@elizabethwarren.com>",
        },
    },
    "es-MX": {
        "IA": {
            "template_name": "voting_location_IA",
            "from_email": "Iowa for Warren <iowa@mail.elizabethwarren.com>",
            "reply_to_email": "Iowa for Warren <iowa@elizabethwarren.com>",
        },
        "NH": {
            "template_name": "voting_location_generic",
            "from_email": "New Hampshire for Warren <newhampshire@mail.elizabethwarren.com>",
            "reply_to_email": "New Hampshire for Warren <newhampshire@elizabethwarren.com>",
        },
        "NV": {
            "template_name": "voting_location_NV_es",
            "from_email": "Nevada por Warren <nevada@mail.elizabethwarren.com>",
            "reply_to_email": "Nevada por Warren <nevada@elizabethwarren.com>",
        },
        "default": {
            "template_name": "voting_location_generic_es",
            "from_email": "ElizabethWarren.com <info@mail.elizabethwarren.com>",
            "reply_to_email": "ElizabethWarren.com <info@elizabethwarren.com>",
        },
    },
}

MOBILE_COMMONS_CAMPAIGN_ID = 189358
VOTING_LOCATION_SMS_BY_LANGUAGE_STATE = {
    "en-US": {
        "IA": {
            "default": {
                "opt_in_path_id": 290677,
                "message": "Your caucus location:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            }
        },
        "NH": {
            "default": {
                "opt_in_path_id": 291258,
                "message": "Your polling location:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            }
        },
        "NV": {
            VOTING_TYPE_EARLY_VOTE: {
                "opt_in_path_id": 292302,
                "message": "Your early vote location:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            },
            "default": {
                "opt_in_path_id": 292305,
                "message": "Your caucus location:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            },
        },
        "default": {
            VOTING_TYPE_EARLY_VOTE: {
                "opt_in_path_id": 294228,
                "message": "Your early vote location:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            },
            VOTING_TYPE_MAIL: {
                "opt_in_path_id": 294243,
                "message": "Learn more about how to vote: {{voter_education_url}}",
            },
            "default": {
                "opt_in_path_id": 294225,
                "message": "Your polling location:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            },
        },
    },
    "es-MX": {
        "IA": {
            "default": {
                "opt_in_path_id": 290677,
                "message": "Tu localizacion de caucus:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            }
        },
        "NH": {
            "default": {
                "opt_in_path_id": 291258,
                "message": "Tu localizacion de votacion:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            }
        },
        "NV": {
            VOTING_TYPE_EARLY_VOTE: {
                "opt_in_path_id": 292302,
                "message": "Tu localizacion de votacion temprana:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            },
            "default": {
                "opt_in_path_id": 292305,
                "message": "Tu localizacion de caucus:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            },
        },
        "default": {
            VOTING_TYPE_EARLY_VOTE: {
                "opt_in_path_id": 294228,
                "message": "Tu localizacion de votacion temprana:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            },
            VOTING_TYPE_MAIL: {
                "opt_in_path_id": 294243,
                "message": "Learn more about how to vote: {{voter_education_url}}",
            },
            "default": {
                "opt_in_path_id": 294225,
                "message": "Tu localizacion de votacion:\n{{name_of_location}}\n{{polling_address}}\n{{polling_city}}, {{polling_state}} {{polling_zip}}\n{{time_of_event}}",
            },
        },
    },
}

FORM_DATA_BSD_FIELDS = {
    "custom-16063": "van_precinct_id",
    "custom-16064": "name_of_location",
    "custom-16065": "time_of_event",
    "custom-16066": "polling_address",
    "custom-16067": "polling_city",
    "custom-16068": "polling_state",
    "custom-16069": "polling_zip",
    "custom-16616": "language",
    "custom-17131": "preferred_voting_type",
    "custom-17132": "results_url",
    "custom-17240": "pollaris_search_id",
    "custom-18152": "voting_period_start",
    "custom-18123": "voting_period_end",
    "custom-18207": "voter_education_url",
}


def after_search(request):
    request_body = request.body
    logging.info(f"After search request: {request_body}")
    success, message = handle_bsd_web_poll_tool_form_submission(request_body)
    logging.info(f"Got success: {success}; message: {message}")
    if not success:
        return bad_request(message=message, code=SearchStatus.BAD_REQUEST)

    resp_body = {"status": "success"}
    return JsonResponse(resp_body)


def handle_bsd_web_poll_tool_form_submission(request_body):
    logging.info(f"handle_bsd_web_poll_tool_form_submission received: {request_body}")
    request_json = json.loads(request_body)

    if not request_json:
        return False, f"Couldn't parse incoming JSON: {request_body}"
    request_form = request_json.get("form", "")
    if not request_form:
        return False, f"Couldn't parse form data: {request_body}"

    # First, submit form as-is to BSD.
    try:
        bsd_succeeded = send_voting_location_bsd(request_json)
    except Exception as e:
        logging.exception(e)
        bsd_succeeded = False
    if not bsd_succeeded:
        logging.error(
            "General failure in submitting to BSD"
        )
        return False, "Failure in submitting to BSD"

    fields = {}
    for k, v in urllib.parse.parse_qs(request_form).items():
        if k in FORM_DATA_BSD_FIELDS:
            fields[FORM_DATA_BSD_FIELDS[k]] = v[0]
        else:
            fields[k] = v[0]

    if "state_cd" not in fields:
        return False, f"Form data doesn't include state_cd: {request_body}"

    fields.setdefault("preferred_voting_type", VOTING_TYPE_DAY_OF)
    # SES templates offer very little in the way of logical conditions;
    # so we create a true/false variable for each possible preferred
    # voting type, which allows tailoring SES template to each voting
    # type.
    for voting_type in VOTING_TYPES:
        fields[voting_type] = fields["preferred_voting_type"] == voting_type

    email = fields.get("email")
    phone = fields.get("phone")

    try:
        send_voting_location_email(email, fields)
    except Exception as e:
        logging.exception(e)
        return False, "Failure in sending voting location email"

    try:
        send_voting_location_sms(email, phone, fields)
    except Exception as e:
        logging.exception(e)
        return False, "Failure in sending voting location SMS"

    return True, "Success"


def send_voting_location_bsd(request_json):
    resp = requests.post(
        BSD_WEB_POLL_TOOL_SUBMIT_URL, headers=BSD_SUBMIT_HEADERS, json=request_json
    )
    print("Got resp from BSD proxy", resp.text)
    return resp.json().get("statusCode") == 202


def send_voting_location_email(email, fields):
    state = fields["state_cd"]
    if not state:
        logging.info("Not sending email with voting location; no state")
        return
    language = fields.get("language", DEFAULT_LANGUAGE)

    details_for_language = VOTING_LOCATION_MAILING_BY_LANGUAGE_STATE.get(
        language, VOTING_LOCATION_MAILING_BY_LANGUAGE_STATE[DEFAULT_LANGUAGE]
    )
    details = details_for_language.get(state, details_for_language["default"])

    # We'll prepare a payload for SES rendering that is a superset of
    # 'fields'.
    ses_fields = fields.copy()

    # Set "transactional" in payload so the footer doesn't render
    # unsubscribe links.
    ses_fields["transactional"] = True

    template_name = details["template_name"]
    if VOTING_LOCATION_MAILING_RECIPIENT_DRAFT_SUFFIX in email:
        template_name += VOTING_LOCATION_MAILING_TEMPLATE_DRAFT_SUFFIX

    email_service = EmailService()
    send_email_args = {
        "template_name": template_name,
        "from_email": details["from_email"],
        "recipient": email,
        "reply_to_email": details["reply_to_email"],
        "configuration_set_name": VOTING_LOCATION_MAILING_CONFIGURATION_SET_NAME,
        "payload": ses_fields,
        "application_name": VOTING_LOCATION_MAILING_APPLICATION_NAME,
    }
    logging.info("SES send_email args:")
    logging.info(pprint.pformat(send_email_args))
    email_service.send_email(**send_email_args)


def send_voting_location_sms(email, phone, fields):
    """Opts-in to SMS and sends caucus/polling location address text message.

    We do two Mobile Commons API calls:

        1. Create or update profile, with a state-specific opt-in path.
           If the number is new to our national Mobile Commons campaign,
           this will subscribe the number to our national campaign and trigger a text message like:

             Team Warren: Thanks for confirming your caucus location! We'll follow-up when it's time to make your voice heard for Elizabeth.
             HELP4INFO/STOP2Quit/Msg&DataRatesMayApply

           If the number if already on our list, this will trigger nothing and no message.

        2. Send a message with caucus/polling location name and address.
    """

    phone = extract_phone_number(phone)

    if not phone:
        logging.info("Not sending SMS with voting location; no phone number")
        return

    state = fields["state_cd"]
    if not state:
        logging.info("Not sending SMS with voting location; no state")
        return
    language = fields.get("language", DEFAULT_LANGUAGE)

    details_for_language = VOTING_LOCATION_SMS_BY_LANGUAGE_STATE.get(
        language, VOTING_LOCATION_SMS_BY_LANGUAGE_STATE[DEFAULT_LANGUAGE]
    )
    details_for_state = details_for_language.get(state, details_for_language["default"])
    details = details_for_state.get(
        fields["preferred_voting_type"], details_for_state["default"]
    )
    first_name, last_name = normalize_name(
        fields.get("firstname", ""), fields.get("lastname", "")
    )

    profile_payload = {
        "phone_number": phone,
        "email": fields.get("email", ""),
        "postal_code": fields.get("zip", ""),
        "first_name": first_name,
        "last_name": last_name,
        "street1": fields.get("addr1", ""),
        "city": fields.get("city", ""),
        "state": state,
        "country": "US",
        "polling_location_name": fields.get("name_of_location"),
        "polling_address": fields.get("polling_address"),
        "polling_city": fields.get("polling_city"),
        "polling_state": fields.get("polling_state"),
        "polling_zip": fields.get("polling_zip"),
        "polling_time": fields.get("time_of_event"),
        "polling_precinct_id": fields.get("van_precinct_id"),
        "opt_in_path_id": details.get("opt_in_path_id"),
    }

    # Don't upload null or empty fields.
    keys_to_delete = [k for k, v in profile_payload.items() if not v]
    for k in keys_to_delete:
        del profile_payload[k]

    resp = create_or_update_mobile_commons_profile(
        settings.MOBILE_COMMONS_USERNAME,
        settings.MOBILE_COMMONS_PASSWORD,
        profile_payload,
    )
    logging.debug(f"Response from mobile commons profile creation: {resp.text}")

    message_template = details["message"]
    message = Template(message_template).render(**fields)
    resp = send_sms(
        settings.MOBILE_COMMONS_USERNAME,
        settings.MOBILE_COMMONS_PASSWORD,
        MOBILE_COMMONS_CAMPAIGN_ID,
        phone,
        message,
    )
    logging.debug(f"Response from mobile commons send: {resp.text}")
