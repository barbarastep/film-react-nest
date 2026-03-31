import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from '../entities/film.entity';
import { ScheduleEntity } from '../entities/schedule.entity';
import { AppRepository } from './app.repository';
import { FilmsRepository } from './films.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])],
  providers: [
    AppRepository,
    {
      provide: FilmsRepository,
      useExisting: AppRepository,
    },
  ],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
