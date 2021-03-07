/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { ClientLog } from '../src';

export const consoleLog: ClientLog = {
  debug: (message) => console.debug(message),
  info: (message) => console.debug(message),
  warn: (message) => console.debug(message),
  error: (message) => console.debug(message),
};
