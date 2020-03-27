import os

import boto3

__SSM_CLIENT = None
SSM_ENV_VAR_PREFIX = "ssm:"
PARAMETER_STORE_REGION_NAME = "us-east-1"


def _get_boto_client_or_create():
    """ Get the boto3 client or create it for the get_env_var """
    global __SSM_CLIENT
    if __SSM_CLIENT:
        return __SSM_CLIENT
    __SSM_CLIENT = boto3.client("ssm", region_name=PARAMETER_STORE_REGION_NAME)
    return __SSM_CLIENT


def get_env_var(name, optional=False, default=None):
    """Load an environment variable with optional Parameter Store lookup

    If the value of an env var starts with "ssm:" we look it up in
    AWS System Manager Parameter Store, otherwise we return it as is.
    """
    if name not in os.environ:
        if optional:
            return default
        raise KeyError(f"Missing required env var: {name}")

    value = os.environ[name]
    if value.startswith(SSM_ENV_VAR_PREFIX):
        ssm_client = _get_boto_client_or_create()
        res = ssm_client.get_parameter(
            Name=value.lstrip(SSM_ENV_VAR_PREFIX), WithDecryption=True
        )
        try:
            return res["Parameter"]["Value"]
        except KeyError:
            raise KeyError(f"Missing ssm paramter: {value}")
    return value
