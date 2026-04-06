import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
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
      const result = logger['formatMessage']('log', 'test message', 'param1', 'param2');
      expect(result).toBe('level=log\tmessage="test message"\toptionalParams=["param1","param2"]');
    });
  });

  describe('log', () => {
    it('should call console.log with formatted message', () => {
      logger.log('test message', 'param1');
      expect(consoleLogSpy).toHaveBeenCalledWith('level=log\tmessage="test message"\toptionalParams=["param1"]');
    });
  });

  describe('error', () => {
    it('should call console.error with formatted message', () => {
      logger.error('error message', 'param1');
      expect(consoleErrorSpy).toHaveBeenCalledWith('level=error\tmessage="error message"\toptionalParams=["param1"]');
    });
  });

  describe('warn', () => {
    it('should call console.warn with formatted message', () => {
      logger.warn('warn message', 'param1');
      expect(consoleWarnSpy).toHaveBeenCalledWith('level=warn\tmessage="warn message"\toptionalParams=["param1"]');
    });
  });

  describe('debug', () => {
    it('should call console.debug with formatted message', () => {
      if (logger.debug) {
        logger.debug('debug message', 'param1');
        expect(consoleDebugSpy).toHaveBeenCalledWith('level=debug\tmessage="debug message"\toptionalParams=["param1"]');
      }
    });
  });

  describe('verbose', () => {
    it('should call console.log with formatted message', () => {
      if (logger.verbose) {
        logger.verbose('verbose message', 'param1');
        expect(consoleLogSpy).toHaveBeenCalledWith('level=verbose\tmessage="verbose message"\toptionalParams=["param1"]');
      }
    });
  });
});
