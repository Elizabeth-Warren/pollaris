import json

import boto3

SES_REGION_NAME = "us-east-1"


class EmailService:
    """ A service for sending emails via SES"""

    def __init__(self, ses_client=None):
        self.ses = (
            ses_client
            if ses_client
            else boto3.client("ses", region_name=SES_REGION_NAME)
        )

    def send_email(
        self,
        template_name,
        from_email,
        recipient,
        reply_to_email,
        configuration_set_name,
        payload,
        application_name,
        bcc_emails=[],
    ):

        request = {
            "Source": from_email,
            "Destination": {"ToAddresses": [recipient], "BccAddresses": bcc_emails},
            "ReplyToAddresses": [reply_to_email],
            "Template": template_name,
            "TemplateData": json.dumps(payload),
            "ConfigurationSetName": configuration_set_name,
            "Tags": [
                {"Name": "application", "Value": application_name},
                {
                    "Name": "mailing_identifier",
                    "Value": f"{application_name}-transactional",
                },
                {"Name": "template", "Value": template_name},
                {"Name": "mail_config", "Value": configuration_set_name},
            ],
        }

        return self.ses.send_templated_email(**request)

