#!/usr/bin/env node
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

export default class StepFunctionStack extends cdk.Stack {
  //
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    //
    super(scope, id, props);

    new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('dist/test-deploy/functions'),
      handler: 'StepFunctionClientFunctions.handler',
    });

    // const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
    //   downstream: hello,
    // });

    // new apigateway.LambdaRestApi(this, 'Endpoint', {
    //   handler: helloWithCounter.handler,
    // });

    // new TableViewer(this, 'ViewHitCounter', {
    //   title: 'Hello Hits',
    //   table: helloWithCounter.table,
    // });

    // // State machine

    // const goodbye = new lambda.Function(this, 'goodbyeHandler', {
    //   runtime: lambda.Runtime.NODEJS_10_X,
    //   code: lambda.Code.fromAsset('dist/lambda'),
    //   handler: 'goodbye.handler',
    // });

    // new StateMachineWithDiagram(
    //   this,
    //   'StateMachineId',
    //   {
    //     stateMachineName: 'MyStateMachine',
    //     stateMachineType: sfn.StateMachineType.STANDARD,
    //   },
    //   (scope) => {
    //     //
    //     const initTask = new sfn.Pass(scope, 'Init', {
    //       result: sfn.Result.fromObject({
    //         wait_time: 10,
    //       }),
    //       resultPath: '$',
    //     });

    //     const goodbyeTask1 = new sfn_tasks.LambdaInvoke(scope, 'Goodbye1', {
    //       lambdaFunction: goodbye,
    //       retryOnServiceExceptions: false,
    //       resultPath: JsonPath.DISCARD,
    //     });

    //     const waitX = new sfn.Wait(scope, 'Wait X Seconds', {
    //       time: sfn.WaitTime.secondsPath('$.wait_time'),
    //     });

    //     const goodbyeTask2 = new sfn_tasks.LambdaInvoke(scope, 'Goodbye2', {
    //       lambdaFunction: goodbye,
    //       retryOnServiceExceptions: false,
    //       resultPath: JsonPath.DISCARD,
    //     });

    //     const goodbyeTask3 = new sfn_tasks.LambdaInvoke(scope, 'Goodbye3', {
    //       lambdaFunction: goodbye,
    //       retryOnServiceExceptions: false,
    //       resultPath: JsonPath.DISCARD,
    //     });

    //     const goodbyeTask4 = new sfn_tasks.LambdaInvoke(scope, 'Goodbye4', {
    //       lambdaFunction: goodbye,
    //       retryOnServiceExceptions: false,
    //       resultPath: JsonPath.DISCARD,
    //     });

    //     const goodbyeTask5 = new sfn_tasks.LambdaInvoke(scope, 'Goodbye5', {
    //       lambdaFunction: goodbye,
    //       retryOnServiceExceptions: false,
    //       resultPath: JsonPath.DISCARD,
    //     });

    //     const parallel = new sfn.Parallel(scope, 'Parallel Goodbye', {
    //       resultPath: JsonPath.DISCARD,
    //     });

    //     const stateMachineDefinition = initTask
    //       .next(waitX)
    //       .next(goodbyeTask1)
    //       .next(goodbyeTask2)
    //       .next(parallel.branch(goodbyeTask3, goodbyeTask4));

    //     return stateMachineDefinition;
    //   }
    // );
  }
}
