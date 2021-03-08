// TODO 28Feb21: Include this in code coverage
/* istanbul ignore file */
// eslint-disable-next-line import/no-extraneous-dependencies
import S3, { DeleteObjectRequest, GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3';
import https from 'https';
import ClientLog from './ClientLog';

const agent = new https.Agent({
  keepAlive: true,
});

const s3 = new S3({
  httpOptions: {
    agent,
  },
});

export default class S3Client {
  //
  static Log: ClientLog | undefined;

  maxKeysOnList: number | undefined = undefined;

  s3: S3;

  constructor(public bucketName?: string, s3Override?: S3) {
    this.s3 = s3Override ?? s3;
  }

  async putObjectAsync(
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: Record<string, any>,
    bucketNameOverride?: string
  ): Promise<void> {
    //
    const bucketName = bucketNameOverride ?? this.bucketName;

    if (bucketName === undefined) throw new Error('bucketName === undefined');

    const putObjectRequest: PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(obj),
      ContentType: 'application/json; charset=utf-8',
    };

    await this.s3.putObject(putObjectRequest).promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getObjectAsync<T extends Record<string, any>>(
    key: string,
    bucketNameOverride?: string
  ): Promise<T> {
    //
    const bucketName = bucketNameOverride ?? this.bucketName;

    if (bucketName === undefined) throw new Error('bucketName === undefined');

    const getObjectRequest: GetObjectRequest = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      const getObjectOutput = await this.s3.getObject(getObjectRequest).promise();

      if (getObjectOutput.Body === undefined) {
        throw new Error(`GetObjectOutput.Body is undefined: ${JSON.stringify(getObjectRequest)}`);
      }

      const obj = JSON.parse(getObjectOutput.Body.toString('utf-8'));
      return obj;
      //
    } catch (error) {
      //
      if (error instanceof Error) {
        if (error.name === 'NoSuchKey') {
          const newError = new Error(
            `The specified key does not exist: ${key}, bucket: ${bucketName}`
          );
          newError.name = error.name;
          throw newError;
        }
      }

      throw error;
    }
  }

  async deleteObjectAsync(key: string, bucketNameOverride?: string): Promise<void> {
    //
    const bucketName = bucketNameOverride ?? this.bucketName;

    if (bucketName === undefined) throw new Error('bucketName === undefined');

    const deleteObjectRequest: DeleteObjectRequest = {
      Bucket: bucketName,
      Key: key,
    };

    await this.s3.deleteObject(deleteObjectRequest).promise();
  }

  async listObjectsAsync(prefix?: string, bucketNameOverride?: string): Promise<S3.ObjectList> {
    //
    const bucketName = bucketNameOverride ?? this.bucketName;

    if (bucketName === undefined) throw new Error('bucketName === undefined');

    let continuationToken: string | undefined;

    let objectList: S3.ObjectList = [];

    do {
      // eslint-disable-next-line no-await-in-loop
      const listObjectsOutput = await this.s3
        .listObjectsV2({
          Prefix: prefix,
          Bucket: bucketName,
          ContinuationToken: continuationToken,
          MaxKeys: this.maxKeysOnList,
        })
        .promise();

      continuationToken = listObjectsOutput.NextContinuationToken;

      objectList = objectList.concat(listObjectsOutput.Contents ?? []);
      //
    } while (continuationToken !== undefined);

    return objectList;
  }
}
