/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { Log } from '../src';

export const consoleLog: Log = {
  debug: (message) => console.debug(message),
  info: (message) => console.debug(message),
  warn: (message) => console.debug(message),
  error: (message) => console.debug(message),
};
