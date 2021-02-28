// TODO 28Feb21: Include this in code coverage
/* istanbul ignore file */
// eslint-disable-next-line import/no-extraneous-dependencies
import StepFunctions, { StartExecutionInput } from 'aws-sdk/clients/stepfunctions';
import https from 'https';
import { Log } from './Log';

const agent = new https.Agent({
  keepAlive: true,
});

const stepFunctions = new StepFunctions({
  httpOptions: {
    agent,
  },
});

export default class StepFunctionClient {
  //
  static Log: Log;

  private stepFunctions: StepFunctions;

  constructor(private stateMachineArn?: string, stepFunctionsOverride?: StepFunctions) {
    this.stepFunctions = stepFunctionsOverride ?? stepFunctions;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async startExecutionAsync(inputObject: Record<string, any>): Promise<void> {
    if (this.stateMachineArn === undefined) throw new Error('this.stateMachineArn === undefined');

    const params: StartExecutionInput = {
      stateMachineArn: this.stateMachineArn,
      input: JSON.stringify(inputObject),
    };

    if (StepFunctionClient.Log.debug) StepFunctionClient.Log.debug('startExecution', { params });

    await this.stepFunctions.startExecution(params).promise();
  }
}
