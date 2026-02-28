import { Injectable, NotFoundException } from '@nestjs/common';

import {
  FilmDto,
  FilmsListDto,
  FilmScheduleDto,
  ScheduleDto,
} from './dto/films.dto';
import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class FilmsService {
  constructor(private readonly repositoryService: RepositoryService) {}

  async getFilms(): Promise<FilmsListDto> {
    const films = await this.repositoryService.getFilms();
    const items = films.map(
      (film): FilmDto => ({
        id: film.id,
        rating: film.rating,
        director: film.director,
        tags: film.tags,
        title: film.title,
        about: film.about,
        description: film.description,
        image: film.image,
        cover: film.cover,
      }),
    );

    return {
      total: items.length,
      items,
    };
  }

  async getFilmSchedule(id: string): Promise<FilmScheduleDto> {
    const schedule = await this.repositoryService.getSchedule(id);

    if (!schedule) {
      throw new NotFoundException({ error: 'Film not found' });
    }

    const items: ScheduleDto[] = schedule.map((session) => ({
      ...session,
      hall: Number(session.hall),
    }));

    return {
      total: items.length,
      items,
    };
  }
}
