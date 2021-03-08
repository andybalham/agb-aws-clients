/* eslint-disable import/no-extraneous-dependencies */
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

  try {
    await s3Client.getObjectAsync('lovely-bunch-of-coconuts');
  } catch (error) {
    console.error(error.message);
  }
};

export const putAndDeleteHandler = async (event: any): Promise<void> => {
  //
  const s3Client = new S3Client(process.env.BUCKET_NAME);

  await s3Client.putObjectAsync(s3Key, event);

  const getObjectResult = await s3Client.getObjectAsync(s3Key);
  console.log(`getObjectResult: ${JSON.stringify(getObjectResult)}`);

  await s3Client.deleteObjectAsync(s3Key);

  try {
    await s3Client.getObjectAsync(s3Key);
  } catch (error) {
    console.error(error.message);
  }
};

export const listObjectsHandler = async (event: any): Promise<void> => {
  //
  const s3Client = new S3Client(process.env.BUCKET_NAME);
  s3Client.maxKeysOnList = 6;

  const prefix = Date.now().toLocaleString();

  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < s3Client.maxKeysOnList * 3 + 1; index++) {
    // eslint-disable-next-line no-await-in-loop
    await s3Client.putObjectAsync(`${prefix}-${index}`, event);
  }

  const listObjectsResult = await s3Client.listObjectsAsync(prefix);

  console.log(`listObjectsResult.length: ${listObjectsResult.length}`);
};
