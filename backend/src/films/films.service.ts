import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly repository: FilmsRepository) {}

  getFilms() {
    return this.repository.getFilms();
  }

  getFilmSchedule(id: string) {
    return this.repository.getFilmSchedule(id);
  }
}
