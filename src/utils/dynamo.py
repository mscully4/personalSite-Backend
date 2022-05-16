from typing import Dict
from boto3.dynamodb.conditions import Key
from mypy_boto3_dynamodb.service_resource import Table


class TableSchema:
    PK = "PK"
    SK = "SK"
    Entity = "Entity"

class Namespaces:
    HOME = "HOME"
    TRAVEL = "TRAVEL"
    RESUMT = "RESUME"

class TravelEntities:
    DESTINATION = "DESTINATION"
    PLACE = "PLACE"
    PHOTO = "PHOTO"
    ALBUM = "ALBUM"

class HomeEntities:
    PHOTO = "PHOTO"

def create_record(pk: str, sk: str, entity: Dict) -> Dict:
    return {
        TableSchema.PK: pk,
        TableSchema.SK: sk,
        TableSchema.Entity: entity,
    }

def query_table(table: Table, key: str = None, value: str = None) -> Dict:
    if key is not None and value is not None:
        filtering_exp = Key(key).eq(value)
        return table.query(KeyConditionExpression=filtering_exp)

    raise ValueError("Parameters missing or invalid")
