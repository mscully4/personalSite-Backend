import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

const date = new Date();

interface apiStackProps extends StackProps {}

export class PersonalSiteStack extends Stack {
  constructor(scope: Construct, id: string, props: apiStackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "staticSiteBucket", {
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
    });

    new BucketDeployment(
      this,
      "staticSiteDeployment",
      {
        destinationBucket: bucket,
        sources: [Source.asset("./build/")],
      }
    );

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    bucket.grantRead(originAccessIdentity);

    new Distribution(this, "personalSiteDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(bucket, { originAccessIdentity }),
      },
    });
  }
}
