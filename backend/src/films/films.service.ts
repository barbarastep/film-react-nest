import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmNotFoundError } from '../repository/repository.errors';

@Injectable()
export class FilmsService {
  constructor(private readonly repository: FilmsRepository) {}

  getFilms() {
    return this.repository.getFilms();
  }

  getFilmSchedule(id: string) {
    return this.repository.getFilmSchedule(id).catch((error: unknown) => {
      if (error instanceof FilmNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    });
  }
}
