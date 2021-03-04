/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-console */
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { PublishInput } from 'aws-sdk/clients/sns';
import { expect } from 'chai';
import { SNSClient } from '../src';

describe('SNSClient Tests', () => {
  //
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore('SNS');
  });

  it('publishes without attributes', async () => {
    //
    // Arrange

    let actualParams: PublishInput | null = null;

    AWSMock.mock('SNS', 'publish', (params: PublishInput, callback: Function) => {
      actualParams = params;
      callback(null);
    });

    const content = { Name: 'Value' };
    const attributes = undefined;

    const sutSNSClient = new SNSClient('TestTopicArn', new AWS.SNS());

    // Act

    await sutSNSClient.publishMessageAsync(content, attributes);

    // Assert

    expect(actualParams).to.not.equal(null);

    expect(actualParams).to.deep.equal({
      TopicArn: 'TestTopicArn',
      Message: '{"Name":"Value"}',
      MessageAttributes: undefined,
    });
  });

  it('publishes with attributes', async () => {
    //
    // Arrange

    let actualParams: PublishInput | null = null;

    AWSMock.mock('SNS', 'publish', (params: PublishInput, callback: Function) => {
      actualParams = params;
      callback(null);
    });

    const content = { Name: 'Value' };
    const attributes = undefined;

    const sutSNSClient = new SNSClient('TestTopicArn', new AWS.SNS());

    // Act

    await sutSNSClient.publishMessageAsync(content, attributes);

    // Assert

    expect(actualParams).to.not.equal(null);

    expect(actualParams).to.deep.equal({
      TopicArn: 'TestTopicArn',
      Message: '{"Name":"Value"}',
      MessageAttributes: undefined,
    });
  });

  it('throws exception when no topicArn', async () => {
    const snsClient = new SNSClient('TopicArn');
    console.log(`snsClient: ${JSON.stringify(snsClient)}`);
  });

  it('publishes with a log', async () => {
    const snsClient = new SNSClient('TopicArn');
    console.log(`snsClient: ${JSON.stringify(snsClient)}`);
  });
});
