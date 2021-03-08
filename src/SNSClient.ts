/* eslint-disable @typescript-eslint/no-explicit-any */
import SNS, {
  MessageAttributeMap,
  MessageAttributeValue,
  PublishInput,
  PublishResponse,
  // eslint-disable-next-line import/no-extraneous-dependencies
} from 'aws-sdk/clients/sns';
import https from 'https';
import ClientLog from './ClientLog';

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
  static Log: ClientLog | undefined;

  sns: SNS;

  constructor(private topicArn?: string, snsOverride?: SNS) {
    this.sns = snsOverride ?? sns;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async publishMessageAsync(
    content: Record<string, any>,
    attributes?: Record<string, any>
  ): Promise<PublishResponse> {
    //
    if (this.topicArn === undefined) throw new Error('this.topicArn === undefined');

    const publishInput: PublishInput = {
      Message: JSON.stringify(content),
      TopicArn: this.topicArn,
      MessageAttributes: SNSClient.getMessageAttributeMap(attributes),
    };

    if (SNSClient.Log?.debug)
      SNSClient.Log.debug('Publishing', { topicArn: this.topicArn, publishInput });

    const publishResponse = await this.sns.publish(publishInput).promise();

    if (SNSClient.Log?.debug)
      SNSClient.Log.debug('Published', { topicArn: this.topicArn, publishResponse });

    return publishResponse;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static getMessageAttributeMap(
    attributes?: Record<string, any>
  ): MessageAttributeMap | undefined {
    //
    if (!attributes) {
      return undefined;
    }

    const messageAttributeValues = Object.entries(attributes).map((attributeEntry) => {
      //
      const attributeName = attributeEntry[0];
      const entryValue = attributeEntry[1];

      const attributeValue: MessageAttributeValue = {
        DataType: SNSClient.getDataType(entryValue),
        StringValue: `${entryValue}`,
      };

      return {
        attributeName,
        attributeValue,
      };
    });

    const messageAttributeMap = messageAttributeValues.reduce((map, value) => {
      // eslint-disable-next-line no-param-reassign
      map[value.attributeName] = value.attributeValue;
      return map;
    }, {});

    return messageAttributeMap;
  }

  private static getDataType(attributeValue: any): string {
    //
    let dataType: string;
    switch (typeof attributeValue) {
      //
      case 'number':
        dataType = 'Number';
        break;

      default:
        dataType = 'String';
        break;
    }

    return dataType;
  }
}
