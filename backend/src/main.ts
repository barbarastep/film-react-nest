import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Afisha API')
    .setDescription('API для фильмов, расписания и бронирования билетов')
    .setVersion('1.0.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const configService = app.get(ConfigService);
  const port = Number(configService.get<string>('PORT') ?? 3000);
  await app.listen(port);
}

bootstrap();
