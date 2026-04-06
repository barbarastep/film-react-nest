import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  let logger: DevLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new DevLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should be instance of ConsoleLogger', () => {
    expect(logger).toBeInstanceOf(require('@nestjs/common').ConsoleLogger);
  });

  it('should have log method', () => {
    expect(typeof logger.log).toBe('function');
  });
});
