import { App } from "aws-cdk-lib";
import { deploymentEnvironments } from "./constants/deploymentEnvironments";
import { DeploymentEnvironment } from "./types/DeploymentEnvironment";
import { StorageStack } from "./stacks/storageStack";
import { ApiStack } from "./stacks/apiStack";
import { PersonalSiteStack } from "./stacks/personalSiteStack";
import { NetworkingStack } from "./stacks/networkingStack";

const appName = "michaeljscullydotcom"
const app = new App();

deploymentEnvironments.forEach((env: DeploymentEnvironment) => {
  const storageStack = new StorageStack(app, `${appName}-storageStack-${env.stage}`, {
    env: env,
  });

  const networkingStack = new NetworkingStack(app, `${appName}-networkingStack-${env.stage}`, {
    env: env
  });

  const apiStack = new ApiStack(app, `${appName}-apiStack-${env.stage}`, {
    env: env,
    sslCertificate: networkingStack.sslCertificate,
    hostedZone: networkingStack.hostedZone,
    dynamoTableName: storageStack.dynamoTableName,
    dynamoTableReadRole: storageStack.dynamoTableReadRole,
    dynamoTableWriteRole: storageStack.dynamoTableWriteRole
  })

  const personalSiteStack = new PersonalSiteStack(app, `${appName}-personalSiteStack-${env.stage}`, {
    env: env,
    sslCertificate: networkingStack.sslCertificate
  })
});
