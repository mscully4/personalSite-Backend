from typing import Dict, List

class EnvironmentVariables:
    DYNAMO_TABLE_NAME = "DYNAMO_TABLE_NAME"
    DYNAMO_READ_ROLE_ARN = "DYNAMO_READ_ROLE_ARN"
    DYNAMO_WRITE_ROLE_ARN = "DYNAMO_WRITE_ROLE_ARN"


def validate_environment(env: Dict, required_env_vars: List):
    for env_var in required_env_vars:
        if env_var not in env:
            raise KeyError(f"Environment varibale {env_var} does not exist")
