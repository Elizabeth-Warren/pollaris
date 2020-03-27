"""ssm utilities"""

import boto3

client = None


def get(name):
    global client
    if client is None:
        client = boto3.client("ssm")
    response = client.get_parameter(Name=name, WithDecryption=True)
    return response.get("Parameter", {}).get("Value")
