from typing import Dict
from boto3.dynamodb.conditions import Key
from mypy_boto3_dynamodb.service_resource import Table
from mypy_boto3_dynamodb.type_defs import QueryOutputTypeDef


class TableSchema:
    PK = "PK"
    SK = "SK"
    Entity = "Entity"


class Namespaces:
    HOME = "HOME"
    TRAVEL = "TRAVEL"
    RESUME = "RESUME"


class TravelEntities:
    DESTINATION = "DESTINATION"
    PLACE = "PLACE"
    PHOTO = "PHOTO"
    ALBUM = "ALBUM"


class HomeEntities:
    PHOTO = "PHOTO"


class ResumeEntities:
    JOB = "JOB"
    EDUCATION = "EDUCATION"
    SKILL = "SKILL"


def create_record(pk: str, sk: str, entity: Dict) -> Dict:
    return {
        TableSchema.PK: pk,
        TableSchema.SK: sk,
        TableSchema.Entity: entity,
    }


def query_table(table: Table, key: str = None, value: str = None):
    if key is None or value is None:
        raise ValueError("Parameters missing or invalid")

    filtering_exp = Key(key).eq(value)
    resp = table.query(KeyConditionExpression=filtering_exp)
    items = [item for item in resp["Items"]]

    while "LastEvaluatedKey" in resp:
        resp: QueryOutputTypeDef = table.query(
            KeyConditionExpression=filtering_exp,
            ExclusiveStartKey=resp["LastEvaluatedKey"],
        )
        items.extend([item for item in resp["Items"]])

    return items
