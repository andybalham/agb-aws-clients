/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-console */
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { PublishInput } from 'aws-sdk/clients/sns';
import { expect } from 'chai';
import { SNSClient } from '../src';
import { consoleLog } from '.';

describe('SNSClient Tests', () => {
  //
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore('SNS');
  });

  [{ log: undefined }, { log: {} }, { log: consoleLog }].forEach((theory) => {
    it(`publishes without attributes: ${JSON.stringify(theory)}`, async () => {
      //
      // Arrange

      let actualParams: PublishInput | null = null;

      AWSMock.mock('SNS', 'publish', (params: PublishInput, callback: Function) => {
        actualParams = params;
        callback(null);
      });

      SNSClient.Log = theory.log;

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
    const attributes = { StringValue: 'Aloha!', NumericValue: 666 };

    const sutSNSClient = new SNSClient('TestTopicArn', new AWS.SNS());

    // Act

    await sutSNSClient.publishMessageAsync(content, attributes);

    // Assert

    expect(actualParams).to.not.equal(null);

    expect(actualParams).to.deep.equal({
      TopicArn: 'TestTopicArn',
      Message: '{"Name":"Value"}',
      MessageAttributes: {
        NumericValue: {
          DataType: 'Number',
          StringValue: '666',
        },
        StringValue: {
          DataType: 'String',
          StringValue: 'Aloha!',
        },
      },
    });
  });

  it('throws exception when no topicArn', async () => {
    //
    const snsClient = new SNSClient();

    try {
      await snsClient.publishMessageAsync({});
      expect.fail('No exception thrown');
    } catch (error) {
      expect(error.message).to.contain('topicArn');
    }
  });
});
