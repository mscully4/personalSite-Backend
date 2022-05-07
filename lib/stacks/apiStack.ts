import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Code, Runtime, LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { Role } from 'aws-cdk-lib/aws-iam';

const date = new Date()

interface apiStackProps extends StackProps {
  dynamoTableReadRole: Role,
  dynamoTableWriteRole: Role,
  dynamoTableName: string,
}

export class ApiStack extends Stack {
  public restApi: RestApi;

  constructor(scope: Construct, id: string, props: apiStackProps) {
    super(scope, id, props);

    this.restApi = new RestApi(this, 'personalSiteRestApi', {})

    const apiLayer = new LayerVersion(this, 'apiLambdaLayer', {
      compatibleRuntimes: [
        Runtime.PYTHON_3_9,
        Runtime.PYTHON_3_8,
      ],
      code: Code.fromAsset('layers/api'),
    });
  }
}
