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

export default class StepFunctionsClient {
  //
  static Log: Log = {};

  private stepFunctions: StepFunctions;

  constructor(private stateMachineArn?: string, stepFunctionsOverride?: StepFunctions) {
    this.stepFunctions = stepFunctionsOverride ?? stepFunctions;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async startExecutionAsync(inputObject: Record<string, any>): Promise<void> {
    //
    if (this.stateMachineArn === undefined) throw new Error('this.stateMachineArn === undefined');

    const params: StartExecutionInput = {
      stateMachineArn: this.stateMachineArn,
      input: JSON.stringify(inputObject),
    };

    if (StepFunctionsClient.Log.debug) StepFunctionsClient.Log.debug('startExecution', { params });

    await this.stepFunctions.startExecution(params).promise();
  }
}
