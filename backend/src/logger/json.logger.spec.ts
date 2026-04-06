import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  describe('formatMessage', () => {
    it('should format message correctly', () => {
      const result = logger['formatMessage'](
        'log',
        'test message',
        'param1',
        'param2',
      );
      const parsed = JSON.parse(result);
      expect(parsed).toEqual({
        level: 'log',
        message: 'test message',
        optionalParams: ['param1', 'param2'],
      });
    });
  });

  describe('log', () => {
    it('should call console.log with formatted message', () => {
      logger.log('test message', 'param1');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'log',
          message: 'test message',
          optionalParams: ['param1'],
        }),
      );
    });
  });

  describe('error', () => {
    it('should call console.error with formatted message', () => {
      logger.error('error message', 'param1');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'error',
          message: 'error message',
          optionalParams: ['param1'],
        }),
      );
    });
  });

  describe('warn', () => {
    it('should call console.warn with formatted message', () => {
      logger.warn('warn message', 'param1');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'warn',
          message: 'warn message',
          optionalParams: ['param1'],
        }),
      );
    });
  });

  describe('debug', () => {
    it('should call console.debug with formatted message', () => {
      if (logger.debug) {
        logger.debug('debug message', 'param1');
        expect(consoleDebugSpy).toHaveBeenCalledWith(
          JSON.stringify({
            level: 'debug',
            message: 'debug message',
            optionalParams: ['param1'],
          }),
        );
      }
    });
  });

  describe('verbose', () => {
    it('should call console.log with formatted message', () => {
      if (logger.verbose) {
        logger.verbose('verbose message', 'param1');
        expect(consoleLogSpy).toHaveBeenCalledWith(
          JSON.stringify({
            level: 'verbose',
            message: 'verbose message',
            optionalParams: ['param1'],
          }),
        );
      }
    });
  });
});
