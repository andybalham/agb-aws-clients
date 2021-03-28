#!/usr/bin/env node
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import * as sqs from '@aws-cdk/aws-sqs';
import * as lambdaEvents from '@aws-cdk/aws-lambda-event-sources';
import dotenv from 'dotenv';
import * as testFunctions from './functions';

dotenv.config();

const isSQSEnabled = process.env.SQS_ENABLED === 'true';

export default class SQSClientStack extends cdk.Stack {
  //
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    //
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'SQSClientQueue', {
      receiveMessageWaitTime: cdk.Duration.seconds(20), // Long poll
      visibilityTimeout: cdk.Duration.seconds(6),
    });

    // Sender function

    const senderFunction = testFunctions.newFunction(
      this,
      'SQSClientSenderFunction',
      'SQSClientFunctions.senderHandler',
      {
        QUEUE_URL: queue.queueUrl,
      }
    );

    queue.grantSendMessages(senderFunction);

    // Consumer function

    const consumerFunction = testFunctions.newFunction(
      this,
      'SQSClientConsumerFunction',
      'SQSClientFunctions.consumerHandler'
    );

    consumerFunction.addEventSource(
      new lambdaEvents.SqsEventSource(queue, {
        enabled: isSQSEnabled,
      })
    );

    queue.grantConsumeMessages(consumerFunction);
  }
}
