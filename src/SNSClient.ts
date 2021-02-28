// TODO 28Feb21: Include this in code coverage
/* istanbul ignore file */
// eslint-disable-next-line import/no-extraneous-dependencies
import SNS, { MessageAttributeMap, MessageAttributeValue, PublishInput, PublishResponse } from 'aws-sdk/clients/sns';
import https from 'https';
import { Log } from './Log';

const agent = new https.Agent({
  keepAlive: true,
});

const sns = new SNS({
  httpOptions: {
    agent,
  },
});

export default class SNSClient {
  //
  static Log: Log;

  private sns: SNS;

  constructor(private topicName?: string, snsOverride?: SNS) {
    this.sns = snsOverride ?? sns;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async publishMessageAsync(content: Record<string, any>, attributes?: Record<string, any>): Promise<PublishResponse> {
    //
    if (this.topicName === undefined) throw new Error('this.topicName === undefined');

    const publishInput: PublishInput = {
      Message: JSON.stringify(content),
      TopicArn: this.topicName,
      MessageAttributes: SNSClient.getMessageAttributeMap(attributes),
    };

    if (SNSClient.Log.debug) SNSClient.Log.debug('Publishing', { topicName: this.topicName, publishInput });

    const publishResponse = await this.sns.publish(publishInput).promise();

    if (SNSClient.Log.debug) SNSClient.Log.debug('Published', { topicName: this.topicName, publishResponse });

    return publishResponse;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static getMessageAttributeMap(attributes?: Record<string, any>): MessageAttributeMap | undefined {
    //
    if (!attributes) {
      return undefined;
    }

    const messageAttributeMap = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const attributeEntry of Object.entries(attributes)) {
      //
      const attributeName = attributeEntry[0];
      const attributeValue = attributeEntry[1];

      let dataType: string;
      switch (typeof attributeValue) {
        //
        case 'string':
          dataType = 'String';
          break;

        case 'number':
          dataType = 'Number';
          break;

        default:
          throw new Error(`Unhandled attribute value type: ${typeof attributeValue}`);
      }

      const messageAttribute: MessageAttributeValue = {
        DataType: dataType,
        StringValue: `${attributeValue}`,
      };

      messageAttributeMap[attributeName] = messageAttribute;
    }

    return messageAttributeMap;
  }
}
