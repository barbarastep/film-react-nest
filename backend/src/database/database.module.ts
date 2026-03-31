import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from '../entities/film.entity';
import { ScheduleEntity } from '../entities/schedule.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const driver = configService.get<string>('DATABASE_DRIVER');
        const url = configService.get<string>('DATABASE_URL');
        const username = configService.get<string>('DATABASE_USERNAME');
        const password = configService.get<string>('DATABASE_PASSWORD');

        if (driver !== 'postgres') {
          throw new Error(
            `Unsupported DATABASE_DRIVER "${driver}". Expected "postgres".`,
          );
        }

        if (!url || !username || !password) {
          throw new Error('Database connection env vars are not configured.');
        }

        return {
          type: 'postgres' as const,
          url,
          username,
          password,
          entities: [FilmEntity, ScheduleEntity],
          synchronize: false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
