/* istanbul ignore file */
import DynamoDBClient from './DynamoDBClient';
import ClientLog from './ClientLog';
import S3Client from './S3Client';
import SNSClient from './SNSClient';
import StepFunctionsClient from './StepFunctionsClient';

export { S3Client, SNSClient, StepFunctionsClient, DynamoDBClient, ClientLog };
