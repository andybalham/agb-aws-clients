/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async function handle(event: any): Promise<any> {
  console.log('request:', JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello, CDK! You've done well to hit ${event.path}\n`,
  };
};
