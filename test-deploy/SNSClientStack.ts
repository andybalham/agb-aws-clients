#!/usr/bin/env node
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as testFunctions from './functions';

export default class SNSClientStack extends cdk.Stack {
  //
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    //
    super(scope, id, props);

    const topic = new sns.Topic(this, 'SNSClientTopic', {
      displayName: 'SNSClient test topic',
    });

    const publishFunction = testFunctions.newFunction(
      this,
      'SNSClientPublishFunction',
      'SNSClientFunctions.publishHandler',
      {
        TOPIC_ARN: topic.topicArn,
      }
    );

    topic.grantPublish(publishFunction);

    const subscribeAllFunction = testFunctions.newFunction(
      this,
      'SNSClientSubscribeAllFunction',
      'SNSClientFunctions.subscribeHandler'
    );

    topic.addSubscription(new subs.LambdaSubscription(subscribeAllFunction));

    const subscribeWithFilterFunction = testFunctions.newFunction(
      this,
      'SNSClientSubscribeWithFilterFunction',
      'SNSClientFunctions.subscribeHandler'
    );

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
