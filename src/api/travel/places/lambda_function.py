from utils.dynamo import Namespaces, TravelEntities
from utils.environment import EnvironmentVariables
from utils.aws_lambda import default_get_handler


from aws_lambda_powertools.utilities.data_classes import (
    APIGatewayProxyEvent,
    event_source,
)

required_env_vars = [
    EnvironmentVariables.DYNAMO_READ_ROLE_ARN,
    EnvironmentVariables.DYNAMO_TABLE_NAME,
    EnvironmentVariables.ACCESS_CONTROL_ALLOW_ORIGIN,
]

partition_key = f"{Namespaces.TRAVEL}#{TravelEntities.PLACE}"


@event_source(data_class=APIGatewayProxyEvent)
def lambda_handler(event: APIGatewayProxyEvent, context):
    return default_get_handler(event, required_env_vars, partition_key)
