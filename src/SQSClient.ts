// TODO 28Feb21: Include this in code coverage
/* istanbul ignore file */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SQS, {
  SendMessageRequest,
  SendMessageResult,
  // eslint-disable-next-line import/no-extraneous-dependencies
} from 'aws-sdk/clients/sqs';
import https from 'https';
import ClientLog from './ClientLog';

const agent = new https.Agent({
  keepAlive: true,
});

const sqs = new SQS({
  httpOptions: {
    agent,
  },
});

export interface MessageProps {
  /**
   *  The length of time, in seconds, for which to delay a specific message. Valid values: 0 to 900. Maximum: 15 minutes. Messages with a positive DelaySeconds value become available for processing after the delay period is finished. If you don't specify a value, the default value for the queue applies.   When you set FifoQueue, you can't set DelaySeconds per message. You can set this parameter only on a queue level.
   */
  DelaySeconds?: number;
  /**
   * This parameter applies only to FIFO (first-in-first-out) queues. The token used for deduplication of sent messages. If a message with a particular MessageDeduplicationId is sent successfully, any messages sent with the same MessageDeduplicationId are accepted successfully but aren't delivered during the 5-minute deduplication interval. For more information, see  Exactly-Once Processing in the Amazon Simple Queue Service Developer Guide.   Every message must have a unique MessageDeduplicationId,   You may provide a MessageDeduplicationId explicitly.   If you aren't able to provide a MessageDeduplicationId and you enable ContentBasedDeduplication for your queue, Amazon SQS uses a SHA-256 hash to generate the MessageDeduplicationId using the body of the message (but not the attributes of the message).    If you don't provide a MessageDeduplicationId and the queue doesn't have ContentBasedDeduplication set, the action fails with an error.   If the queue has ContentBasedDeduplication set, your MessageDeduplicationId overrides the generated one.     When ContentBasedDeduplication is in effect, messages with identical content sent within the deduplication interval are treated as duplicates and only one copy of the message is delivered.   If you send one message with ContentBasedDeduplication enabled and then another message with a MessageDeduplicationId that is the same as the one generated for the first MessageDeduplicationId, the two messages are treated as duplicates and only one copy of the message is delivered.     The MessageDeduplicationId is available to the consumer of the message (this can be useful for troubleshooting delivery issues). If a message is sent successfully but the acknowledgement is lost and the message is resent with the same MessageDeduplicationId after the deduplication interval, Amazon SQS can't detect duplicate messages. Amazon SQS continues to keep track of the message deduplication ID even after the message is received and deleted.  The maximum length of MessageDeduplicationId is 128 characters. MessageDeduplicationId can contain alphanumeric characters (a-z, A-Z, 0-9) and punctuation (!"#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~). For best practices of using MessageDeduplicationId, see Using the MessageDeduplicationId Property in the Amazon Simple Queue Service Developer Guide.
   */
  MessageDeduplicationId?: string;
  /**
   * This parameter applies only to FIFO (first-in-first-out) queues. The tag that specifies that a message belongs to a specific message group. Messages that belong to the same message group are processed in a FIFO manner (however, messages in different message groups might be processed out of order). To interleave multiple ordered streams within a single queue, use MessageGroupId values (for example, session data for multiple users). In this scenario, multiple consumers can process the queue, but the session data of each user is processed in a FIFO fashion.   You must associate a non-empty MessageGroupId with a message. If you don't provide a MessageGroupId, the action fails.    ReceiveMessage might return messages with multiple MessageGroupId values. For each MessageGroupId, the messages are sorted by time sent. The caller can't specify a MessageGroupId.   The length of MessageGroupId is 128 characters. Valid values: alphanumeric characters and punctuation (!"#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~). For best practices of using MessageGroupId, see Using the MessageGroupId Property in the Amazon Simple Queue Service Developer Guide.   MessageGroupId is required for FIFO queues. You can't use it for Standard queues.
   */
  MessageGroupId?: string;
}

export default class SQSClient {
  //
  static Log: ClientLog | undefined;

  sqs: SQS;

  constructor(private queueUrl?: string, sqsOverride?: SQS) {
    this.sqs = sqsOverride ?? sqs;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendMessageAsync(
    messageBody: Record<string, any>,
    messageProps?: MessageProps
  ): Promise<SendMessageResult> {
    //
    if (this.queueUrl === undefined) throw new Error('this.queueUrl === undefined');

    const sendMessageRequest: SendMessageRequest = {
      ...messageProps,
      ...{
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(messageBody),
      },
    };

    if (SQSClient.Log?.debug)
      SQSClient.Log.debug('Sending', {
        topicArn: this.queueUrl,
        SendMessageRequest: sendMessageRequest,
      });

    try {
      const sendMessageResult = await this.sqs.sendMessage(sendMessageRequest).promise();

      if (SQSClient.Log?.debug)
        SQSClient.Log.debug('Sent', { topicArn: this.queueUrl, sendMessageResult });

      return sendMessageResult;
      //
    } catch (error) {
      if (SQSClient.Log?.error) {
        SQSClient.Log.error('Error sending message', { sendMessageRequest }, error);
      } else {
        // eslint-disable-next-line no-console
        console.error(
          `${error.stack}\n\nError sending message: ${JSON.stringify(sendMessageRequest)}`
        );
      }

      throw error;
    }
  }
}