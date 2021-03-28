/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { SQSClient } from '../../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const senderHandler = async (message: any): Promise<void> => {
  //
  const sqsClient = new SQSClient(process.env.QUEUE_URL);

  await sqsClient.sendMessageAsync(message);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const consumerHandler = async (message: any): Promise<void> => {
  //
  console.log(`message: ${JSON.stringify(message)}`);
};
