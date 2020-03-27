import json

import boto3
import botocore.exceptions
import contentful

SES_REGION_NAME = "us-east-1"
CONTENTFUL_CONTENT_TYPE_MAILING = "mailing"


class SesEmailTemplate:
    """Prepares and sends an Amazon Simple Email Service Mail with content from Contentful.

    There are two models:
    - Boilerplate: specifies a set of shared header and footer reusable across mailings
    - Mailing: specifies subject line, body content, boilerplate, from, BCC,
               and the SES configuration_set_name.
    """

    def __init__(self, contentful_space_id, contentful_access_token, mailing_name):
        self.contentful_client = contentful.Client(
            contentful_space_id, contentful_access_token
        )
        self.ses = boto3.client("ses", region_name=SES_REGION_NAME)
        self.mailing_name = mailing_name
        self.mailing_entry = self._update_or_create_ses_template(mailing_name)

    def send(self, recipient, payload):
        request = {
            "Source": self.mailing_entry.from_email,
            "Destination": {
                "ToAddresses": [recipient],
                "BccAddresses": self.mailing_entry.fields().get("bcc_emails", []),
            },
            "ReplyToAddresses": [self.mailing_entry.reply_to_email],
            "Template": self.mailing_name,
            "TemplateData": json.dumps(payload),
            "ConfigurationSetName": self.mailing_entry.configuration_set_name,
        }
        response = self.ses.send_templated_email(**request)

        return {
            "response": response,
            "configuration_set_name": self.mailing_entry.configuration_set_name,
        }

    def _update_or_create_ses_template(self, mailing_name):
        """Creates or updates SES template from mailing and boilerplate in Contentful.

        Returns Mailing entry from Contentful.
        """
        mailing_entries = self.contentful_client.entries(
            {
                "content_type": CONTENTFUL_CONTENT_TYPE_MAILING,
                "fields.name[match]": mailing_name,
            }
        )
        if len(mailing_entries) != 1:
            raise ValueError(
                f"Could not precisely find mailing in contentful: {mailing_name}"
            )
        mailing_entry = mailing_entries[0]

        boilerplate = mailing_entry.boilerplate
        text_part = (
            boilerplate.fields().get("text_header", "")
            + mailing_entry.text_template
            + boilerplate.fields().get("text_footer", "")
        )
        html_part = (
            boilerplate.fields().get("html_header", "")
            + mailing_entry.html_template
            + boilerplate.fields().get("html_footer", "")
        )

        ses_template_spec = {
            "TemplateName": mailing_name,
            "SubjectPart": mailing_entry.subject,
            "TextPart": text_part,
            "HtmlPart": html_part,
        }
        try:
            self.ses.update_template(Template=ses_template_spec)
        except self.ses.exceptions.TemplateDoesNotExistException:
            self.ses.create_template(Template=ses_template_spec)

        return mailing_entry
