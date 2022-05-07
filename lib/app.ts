import { App } from "aws-cdk-lib";
import { deploymentEnvironments } from "./constants/deploymentEnvironments";
import { DeploymentEnvironment } from "./types/DeploymentEnvironment";

const appName = "michaeljscullydotcom"
const app = new App();

deploymentEnvironments.forEach((env: DeploymentEnvironment) => {

});
