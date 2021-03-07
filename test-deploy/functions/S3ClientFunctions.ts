/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { S3Client } from '../../src';

const s3Key = 'myKey';

export const putAndGetHandler = async (event: any): Promise<void> => {
  //
  const s3Client = new S3Client(process.env.BUCKET_NAME);

  await s3Client.putObjectAsync(s3Key, event);

  const getObjectResult = await s3Client.getObjectAsync(s3Key);

  console.log(`getObjectResult: ${JSON.stringify(getObjectResult)}`);
};

export const unknownKeyHandler = async (): Promise<void> => {
  //
  const s3Client = new S3Client(process.env.BUCKET_NAME);

  await s3Client.getObjectAsync('lovely-bunch-of-coconuts');
};
