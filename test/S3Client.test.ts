import { S3Client } from '../src';

it('description', async () => {
  const s3Client = new S3Client('BucketName');
  console.log(`s3Client: ${JSON.stringify(s3Client)}`);
});
