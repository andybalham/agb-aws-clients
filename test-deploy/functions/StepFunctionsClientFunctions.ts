/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import { StepFunctionsClient } from '../../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const startExecutionHandler = async (event: any): Promise<void> => {
  //
  const stepFunctionsClient = new StepFunctionsClient(process.env.STATE_MACHINE_ARN);

  await stepFunctionsClient.startExecutionAsync(event);
};
