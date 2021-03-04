/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { SNSClient } from '../../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const publishHandler = async (event: any): Promise<void> => {
  //
  const snsClient = new SNSClient(process.env.TOPIC_ARN);

  await snsClient.publishMessageAsync(event.content, event.attributes);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subscribeHandler = async (message: any): Promise<void> => {
  //
  console.log(`message: ${JSON.stringify(message)}`);
};
