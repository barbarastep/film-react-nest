import { Controller, Get, Param } from '@nestjs/common';

import { FilmScheduleDto, FilmsListDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<FilmsListDto> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string): Promise<FilmScheduleDto> {
    return this.filmsService.getFilmSchedule(id);
  }
}
