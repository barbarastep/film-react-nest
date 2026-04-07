import { DevLogger } from './dev.logger';
import { ConsoleLogger } from '@nestjs/common';

describe('DevLogger', () => {
  let logger: DevLogger;

  beforeEach(() => {
    logger = new DevLogger();
  });

  it('should be instance of ConsoleLogger', () => {
    expect(logger).toBeInstanceOf(ConsoleLogger);
  });

  it('should have log method', () => {
    expect(typeof logger.log).toBe('function');
  });
});
