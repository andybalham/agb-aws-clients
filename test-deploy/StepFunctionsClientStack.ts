#!/usr/bin/env node
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as sfn_tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as logs from '@aws-cdk/aws-logs';
import * as testFunctions from './functions';

export default class StepFunctionsClientStack extends cdk.Stack {
  //
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    //
    super(scope, id, props);

    const logInputFunction = testFunctions.newFunction(
      this,
      'LogInputFunction',
      'StepFunctionsClientFunctions.logInputHandler'
    );

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      stateMachineType: sfn.StateMachineType.EXPRESS,
      definition: sfn.Chain.start(
        new sfn_tasks.LambdaInvoke(this, 'LogInput', {
          lambdaFunction: logInputFunction,
        })
      ),
      logs: {
        destination: new logs.LogGroup(this, 'StateMachineLogGroup'),
        level: sfn.LogLevel.ALL,
      },
    });

    const startStateMachineFunction = testFunctions.newFunction(
      this,
      'StartStateMachine',
      'StepFunctionsClientFunctions.startExecutionHandler',
      {
        STATE_MACHINE_ARN: stateMachine.stateMachineArn,
      }
    );

    stateMachine.grantStartExecution(startStateMachineFunction);
  }
}
