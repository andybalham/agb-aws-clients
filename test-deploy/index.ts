#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-new */
// eslint-disable-next-line import/no-extraneous-dependencies
import * as cdk from '@aws-cdk/core';
import { Tags } from '@aws-cdk/core';
import S3ClientStack from './S3ClientStack';
import StepFunctionStack from './StepFunctionClientStack';

const app = new cdk.App();
Tags.of(app).add('package', 'agb-aws-clients');

new S3ClientStack(app, 'S3ClientTest');
new StepFunctionStack(app, 'StepFunctionTest');
