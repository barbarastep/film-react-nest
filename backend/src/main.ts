import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  const loggerType = configService.get<string>('LOGGER_TYPE') ?? 'tskv';
  let logger;
  switch (loggerType) {
    case 'dev':
      logger = new DevLogger();
      break;
    case 'json':
      logger = new JsonLogger();
      break;
    case 'tskv':
    default:
      logger = new TskvLogger();
      break;
  }
  app.useLogger(logger);

  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();
