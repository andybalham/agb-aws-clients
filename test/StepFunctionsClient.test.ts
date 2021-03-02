/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-types */
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { expect } from 'chai';
import { StartExecutionInput } from 'aws-sdk/clients/stepfunctions';
import { StepFunctionsClient } from '../src';

beforeEach(async (done) => {
  // get requires env vars
  done();
});

describe('the module', () => {
  //
  [
    { log: {} },
    {
      log: {
        debug: (message: string, params?: Record<string, any>): void => {
          console.debug(`${message}: ${JSON.stringify(params)}`);
        },
      },
    },
  ].forEach((theory) => {
    it(`starts execution with input: ${JSON.stringify(theory)}`, async () => {
      // Arrange

      AWSMock.setSDKInstance(AWS);

      let actualParams: StartExecutionInput | null = null;

      AWSMock.mock('StepFunctions', 'startExecution', (params: StartExecutionInput, callback: Function) => {
        actualParams = params;
        callback(null);
      });

      StepFunctionsClient.Log = theory.log;
      const sutStepFunctionsClient = new StepFunctionsClient('arn', new AWS.StepFunctions());

      const inputObject = { p1: 666, p2: 'beast' };

      // Act

      await sutStepFunctionsClient.startExecutionAsync(inputObject);

      // Assert

      expect(actualParams).to.not.equal(null);

      expect(((actualParams as unknown) as StartExecutionInput).input).to.equal(JSON.stringify(inputObject));

      AWSMock.restore('StepFunctions');
    });
  });

  it('stateMachineArn not specified results in an exception', async () => {
    // Arrange

    const sutStepFunctionsClient = new StepFunctionsClient();

    // Act

    let actualError: Error | null = null;

    try {
      await sutStepFunctionsClient.startExecutionAsync({});
    } catch (error) {
      actualError = error as Error;
    }

    // Assert

    expect(actualError).to.not.equal(null);
    expect(actualError?.message).to.equal('this.stateMachineArn === undefined');
  });
});

// /* eslint-disable no-console */
// /* eslint-disable @typescript-eslint/ban-types */
// import * as AWSMock from 'aws-sdk-mock';
// import * as AWS from 'aws-sdk';
// import { expect } from 'chai';
// // import { StartExecutionInput } from 'aws-sdk/clients/stepfunctions';
// import { GetItemInput } from 'aws-sdk/clients/dynamodb';
// // import { StepFunctionsClient } from '../src';

// beforeEach('mock out dependencies', async (done) => {
//   done();
// });

// afterEach('restore dependencies', () => {});

// describe('StepFunctionsClient tests', () => {
//   //

//   it.only('should mock getItem from DynamoDB', async () => {
//     // Overwriting DynamoDB.getItem()
//     AWSMock.setSDKInstance(AWS);
//     AWSMock.mock('DynamoDB', 'getItem', (params: GetItemInput, callback: Function) => {
//       console.log('DynamoDB', 'getItem', 'mock called');
//       callback(null, { pk: 'foo', sk: 'bar' });
//     });

//     const input: GetItemInput = { TableName: '', Key: {} };
//     const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
//     expect(await dynamodb.getItem(input).promise()).to.deep.equal({ pk: 'foo', sk: 'bar' });

//     AWSMock.restore('DynamoDB');
//   });

// });
