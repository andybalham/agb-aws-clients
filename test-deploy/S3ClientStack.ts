#!/usr/bin/env node
/* eslint-disable no-new */
// eslint-disable-next-line import/no-extraneous-dependencies
import * as cdk from '@aws-cdk/core';

export default class S3ClientStack extends cdk.Stack {
  //
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    //
    super(scope, id, props);
  }
}
