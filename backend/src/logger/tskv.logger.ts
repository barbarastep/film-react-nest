import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]) {
    const fields = [
      `level=${level}`,
      `message=${JSON.stringify(message)}`,
      `optionalParams=${JSON.stringify(optionalParams)}`,
    ];
    return fields.join('\t');
  }

  /**
   * Write a 'log' level log.
   */
  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  /**
   * Write an 'error' level log.
   */
  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: unknown, ...optionalParams: unknown[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
