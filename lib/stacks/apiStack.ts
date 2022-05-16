import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi, Resource, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'
import { Code, Runtime, LayerVersion, Function } from 'aws-cdk-lib/aws-lambda';
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

    // Home Resource
    const homeApiResource = new Resource(this, 'homeApiResource', {
      pathPart: 'home',
      parent: this.restApi.root
    })

    // Travel Resource
    const travelApiResource = new Resource(this, 'travelApiResource', {
      pathPart: 'travel',
      parent: this.restApi.root
    })

     // Destinations
    const destinationsApiResource = new Resource(this, 'destinationsApiResource', {
      pathPart: 'destinations',
      parent: travelApiResource
    })

    const destinationsGetFunction = new Function(this, 'destinationsGetFunction', {
      runtime: Runtime.PYTHON_3_8,
      memorySize: 1024,
      timeout: Duration.seconds(30),
      handler: "api.travel.destinations.lambda_function.lambda_handler",
      code: Code.fromAsset('src/'),
      environment: {
        PYTHONPATH: "/var/runtime:/opt",
        DYNAMO_READ_ROLE_ARN: props.dynamoTableReadRole.roleArn,
        DYNAMO_TABLE_NAME: props.dynamoTableName,
        DATETIME: date.toISOString()
      },
      layers: [apiLayer]
    })

    if (destinationsGetFunction.role) {
      props.dynamoTableReadRole.grant(destinationsGetFunction.role, 'sts:AssumeRole')
    }

    destinationsApiResource.addMethod('GET', new LambdaIntegration(destinationsGetFunction), {})

    // Places
    const placesApiResource = new Resource(this, 'placesApiResource', {
      pathPart: 'places',
      parent: travelApiResource
    })

    const placesGetFunction = new Function(this, 'placesGetFunction', {
      runtime: Runtime.PYTHON_3_8,
      memorySize: 1024,
      timeout: Duration.seconds(30),
      handler: "api.travel.places.lambda_function.lambda_handler",
      code: Code.fromAsset("src/"),
      environment: {
        PYTHONPATH: "/var/runtime:/opt",
        DYNAMO_READ_ROLE_ARN: props.dynamoTableReadRole.roleArn,
        DYNAMO_TABLE_NAME: props.dynamoTableName,
        DATETIME: date.toISOString()
      },
      layers: [apiLayer]
    })

    if (placesGetFunction.role) {
      props.dynamoTableReadRole.grant(placesGetFunction.role, 'sts:AssumeRole')
    }

    placesApiResource.addMethod("GET", new LambdaIntegration(placesGetFunction), {})

     // Photos
     const photosApiResource = new Resource(this, 'photosApiResource', {
      pathPart: 'photos',
      parent: travelApiResource
    })

    const photosGetFunction = new Function(this, 'photosGetFunction', {
      runtime: Runtime.PYTHON_3_8,
      memorySize: 1024,
      timeout: Duration.seconds(30),
      handler: "api.travel.photos.lambda_function.lambda_handler",
      code: Code.fromAsset("src/"),
      environment: {
        PYTHONPATH: "/var/runtime:/opt",
        DYNAMO_READ_ROLE_ARN: props.dynamoTableReadRole.roleArn,
        DYNAMO_TABLE_NAME: props.dynamoTableName,
        DATETIME: date.toISOString()
      },
      layers: [apiLayer]
    })

    if (photosGetFunction.role) {
      props.dynamoTableReadRole.grant(photosGetFunction.role, 'sts:AssumeRole')
    }

    photosApiResource.addMethod("GET", new LambdaIntegration(photosGetFunction), {})

    // Albums
    const albumsApiResource = new Resource(this, 'albumsApiResource', {
      pathPart: 'albums',
      parent: travelApiResource
    })

    const albumsGetFunction = new Function(this, 'albumsGetFunction', {
      runtime: Runtime.PYTHON_3_8,
      memorySize: 1024,
      timeout: Duration.seconds(30),
      handler: "api.travel.albums.lambda_function.lambda_handler",
      code: Code.fromAsset("src/"),
      environment: {
        PYTHONPATH: "/var/runtime:/opt",
        DYNAMO_READ_ROLE_ARN: props.dynamoTableReadRole.roleArn,
        DYNAMO_TABLE_NAME: props.dynamoTableName,
        DATETIME: date.toISOString()
      },
      layers: [apiLayer]
    })

    props.dynamoTableReadRole.grant(albumsGetFunction.role!, 'sts:AssumeRole')

    albumsApiResource.addMethod("GET", new LambdaIntegration(albumsGetFunction), {})
  }
}
