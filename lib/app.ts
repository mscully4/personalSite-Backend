import { App } from "aws-cdk-lib";
import { deploymentEnvironments } from "./constants/deploymentEnvironments";
import { DeploymentEnvironment } from "./types/DeploymentEnvironment";
import { StorageStack } from "./stacks/storageStack";
import { ApiStack } from "./stacks/apiStack";

const appName = "michaeljscullydotcom"
const app = new App();

deploymentEnvironments.forEach((env: DeploymentEnvironment) => {
  const storageStack = new StorageStack(app, `${appName}-storageStack-${env.stage}`, {
    env: env,
  });

  const apiStack = new ApiStack(app, `${appName}-apiStack-${env.stage}`, {
    env: env,
    dynamoTableName: storageStack.dynamoTableName,
    dynamoTableReadRole: storageStack.dynamoTableReadRole,
    dynamoTableWriteRole: storageStack.dynamoTableWriteRole
  })
});
