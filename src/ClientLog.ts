/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ClientLog {
  //
  debug?: (message: string, params?: Record<string, any>) => void;

  error?: (message: string, params?: Record<string, any>, err?: Error) => void;

  info?: (message: string, params?: Record<string, any>) => void;

  warn?: (message: string, params?: any, err?: Error) => void;
}
