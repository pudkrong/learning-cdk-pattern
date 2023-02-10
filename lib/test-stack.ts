import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AlbToFargate,
  AlbToFargateProps,
} from "@aws-solutions-constructs/aws-alb-fargate";
import { ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { EcrImage } from "aws-cdk-lib/aws-ecs";
import { CfnOutput } from "aws-cdk-lib";

export class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const constructProps: AlbToFargateProps = {
      listenerProps: {
        protocol: ApplicationProtocol.HTTP,
        open: true,
        port: 80,
      },
      publicApi: true,
      containerDefinitionProps: {
        image: EcrImage.fromRegistry("traefik/whoami"),
        cpu: 256,
        memoryLimitMiB: 512,
        portMappings: [
          {
            containerPort: 80,
            hostPort: 80,
          },
        ],
      },
      logAlbAccessLogs: false,
    };

    const cluster = new AlbToFargate(this, "new-construct", constructProps);

    new CfnOutput(this, "lb", {
      exportName: "loadbalancerDNSName",
      value: cluster.loadBalancer.loadBalancerDnsName,
    });
  }
}
