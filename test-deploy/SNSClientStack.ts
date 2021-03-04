#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as lambda from '@aws-cdk/aws-lambda';

export default class SNSClientStack extends cdk.Stack {
  //
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    //
    super(scope, id, props);

    const topic = new sns.Topic(this, 'SNSClientTopic', {
      displayName: 'SNSClient test topic',
    });

    const publishFunction = new lambda.Function(this, 'SNSClientPublishFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('dist'),
      handler: 'test-deploy/functions/SNSClientFunctions.publishHandler',
      environment: {
        TOPIC_ARN: topic.topicArn,
      },
    });

    topic.grantPublish(publishFunction);

    const subscribeAllFunction = new lambda.Function(this, 'SNSClientSubscribeAllFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('dist'),
      handler: 'test-deploy/functions/SNSClientFunctions.subscribeHandler',
    });

    topic.addSubscription(new subs.LambdaSubscription(subscribeAllFunction));

    const subscribeWithFilterFunction = new lambda.Function(this, 'SNSClientSubscribeWithFilterFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('dist'),
      handler: 'test-deploy/functions/SNSClientFunctions.subscribeHandler',
    });

    topic.addSubscription(
      new subs.LambdaSubscription(subscribeWithFilterFunction, {
        filterPolicy: {
          stringValue: sns.SubscriptionFilter.stringFilter({
            whitelist: ['Aloha!', 'Howdy!'],
          }),
          numberValue: sns.SubscriptionFilter.numericFilter({
            between: { start: 616, stop: 666 },
          }),
        },
      })
    );
  }
}
