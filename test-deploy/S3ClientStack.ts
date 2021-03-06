#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as testFunctions from './functions';

export default class S3ClientStack extends cdk.Stack {
  //
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    //
    super(scope, id, props);

    const testBucket = new s3.Bucket(this, 'TestBucket', {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const putAndGetFunction = testFunctions.newFunction(
      this,
      'PutAndGetS3ClientFunction',
      'S3ClientFunctions.putAndGetHandler',
      {
        BUCKET_NAME: testBucket.bucketName,
      }
    );
    testBucket.grantReadWrite(putAndGetFunction);

    const unknownKeyFunction = testFunctions.newFunction(
      this,
      'UnknownKeyS3ClientFunction',
      'S3ClientFunctions.unknownKeyHandler',
      {
        BUCKET_NAME: testBucket.bucketName,
      }
    );
    testBucket.grantReadWrite(unknownKeyFunction);

    const putAndDeleteFunction = testFunctions.newFunction(
      this,
      'PutAndDeleteS3ClientFunction',
      'S3ClientFunctions.putAndDeleteHandler',
      {
        BUCKET_NAME: testBucket.bucketName,
      }
    );
    testBucket.grantReadWrite(putAndDeleteFunction);

    const listObjectsFunction = testFunctions.newFunction(
      this,
      'ListObjectsS3ClientFunction',
      'S3ClientFunctions.listObjectsHandler',
      {
        BUCKET_NAME: testBucket.bucketName,
      }
    );
    testBucket.grantReadWrite(listObjectsFunction);
  }
}
