import json
import boto3
import os
import logging
from utils.sts import create_sts_session
from utils.dynamo import Namespaces, TravelEntities, query_table, TableSchema
from utils.encoders import DecimalEncoder
from utils.environment import EnvironmentVariables, validate_environment

from typing import Dict
from mypy_boto3_sts.client import STSClient
from mypy_boto3_dynamodb.service_resource import DynamoDBServiceResource, Table
from mypy_boto3_dynamodb.type_defs import QueryOutputTypeDef
from aws_lambda_powertools.utilities.data_classes import (
    APIGatewayProxyEvent,
    event_source,
)

logger = logging.getLogger(__name__)
logger.setLevel("INFO")

required_env_vars = [
    EnvironmentVariables.DYNAMO_READ_ROLE_ARN,
    EnvironmentVariables.DYNAMO_TABLE_NAME,
]

partition_key = f"{Namespaces.TRAVEL}#{TravelEntities.PHOTO}"

@event_source(data_class=APIGatewayProxyEvent)       
def lambda_handler(event: APIGatewayProxyEvent, context):
    logger.info("Body: %s", event.raw_event)

    logger.info("Validating Environment Variables")
    env: Dict = dict(os.environ)
    validate_environment(env, required_env_vars)

    sts_client: STSClient = boto3.Session().client("sts")
    dynamo: DynamoDBServiceResource = create_sts_session(
        sts_client=sts_client,
        role_arn=env[EnvironmentVariables.DYNAMO_READ_ROLE_ARN],
        role_session_name="GET_PHOTOS",
    ).resource("dynamodb")

    table: Table = dynamo.Table(env[EnvironmentVariables.DYNAMO_TABLE_NAME])

    response: QueryOutputTypeDef = query_table(table, TableSchema.PK, partition_key)
    serialized_results: str = json.dumps(
        response["Items"] if "Items" in response else [], cls=DecimalEncoder
    )
    
    return {
        'statusCode': 200,
        'body': serialized_results
    }