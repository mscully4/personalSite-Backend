# role = "arn:aws:iam::735029168602:role/michaeljscullydotcom-stor-travelMapTableWriteRole7-78NXCVJVKC9R"

import boto3
import json

# ddb = boto3.Session(region="us-west-2").resource("dynamodb")
# table = ddb.Table("travel.photos")
# response = table.scan()
# import json
# from decimal import Decimal
# class DecimalEncoder(json.JSONEncoder):
#     def default(self, o):
#         if isinstance(o, Decimal):
#             return str(o)
#         return super(DecimalEncoder, self).default(o)

# with open("./data/photos.json", "w") as fh:
#     json.dump(response, fh, cls=DecimalEncoder)


ddb = boto3.Session(region_name="us-west-2").resource("dynamodb")
# table = ddb.Table("michaeljscullydotcom-storageStack-prod-michaeljscullyDataTable413CE042-NYNU66J538U0")

# with open("data/albums.json") as fh:
#     data = json.load(fh)

# new_bucket = "michaeljscullydotcom-sto-travelmapphotosbucket08f-1efqt6r1m0sqd.s3.us-west-2.amazonaws.com"
old_bucket = "michaeljscullydotcom-home.s3.us-east-2.amazonaws.com"

# for record in data['Items']:
#     record['cover_photo_src'] = record['cover_photo_src'].replace(old_bucket, new_bucket)

#     # record['url'] = record['url'].replace(old_bucket, new_bucket)
#     new = {
#         "PK": "TRAVEL#ALBUM",
#         "SK": record['album_id'],
#         "Entity": record
#     }
#     table.put_item(Item=new)
#     # print(record)
#     # break

# old_table = "michaeljscullydotcom-storageStack-prod-michaeljscullyDataTable413CE042-NYNU66J538U0"
ddb = boto3.Session(region_name="us-east-2").resource("dynamodb")
old_table = "home.photos"
table = ddb.Table(old_table)
data = table.scan()['Items']

ddb = boto3.Session(region_name="us-west-2").resource("dynamodb")
new_table = "michaeljscullydotcom-storageStack-prod-personalSiteTable68E02C46-17FYKB4CR7NKK"
table = ddb.Table(new_table)

new_bucket = "michaeljscullydotcom-sto-homephotosbucket248c63c5-ynfl0cb0bjm3.s3.us-west-2.amazonaws.com"

for row in data:
    row['src'] = row['src'].replace(old_bucket, new_bucket)
    new = {
        "PK": "HOME#PHOTO",
        "SK": row["photo_id"],
        "Entity": row
    }
    table.put_item(Item=new)

# table = ddb.Table(old_table)
# data = table.scan()['Items']
# table = ddb.Table(new_table)
# for record in data:
#     # print(record["PK"])
#     table.put_item(Item=record)

