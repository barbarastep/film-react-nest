import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { FilmScheduleDto, FilmsListDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
@ApiTags('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  @ApiOperation({ summary: 'Получение списка фильмов' })
  @ApiOkResponse({ type: FilmsListDto, description: 'Список фильмов' })
  async getFilms(): Promise<FilmsListDto> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Получение расписания выбранного фильма' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор фильма',
    example: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
  })
  @ApiOkResponse({ type: FilmScheduleDto, description: 'Расписание фильма' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Фильм не найден',
    schema: {
      example: {
        error: 'Film not found',
      },
    },
  })
  async getFilmSchedule(@Param('id') id: string): Promise<FilmScheduleDto> {
    return this.filmsService.getFilmSchedule(id);
  }
}
