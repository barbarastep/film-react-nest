import { ApiProperty } from '@nestjs/swagger';

export class ScheduleDto {
  @ApiProperty({
    example: '95ab4a20-9555-4a06-bfac-184b8c53fe70',
    description: 'Идентификатор сеанса',
  })
  id: string;
  @ApiProperty({
    example: '2024-06-28T10:00:53+03:00',
    description: 'Дата и время сеанса (ISO-8601)',
  })
  daytime: string;
  @ApiProperty({
    example: 1,
    description: 'Номер зала',
  })
  hall: number;
  @ApiProperty({
    example: 5,
    description: 'Количество рядов в зале',
  })
  rows: number;
  @ApiProperty({
    example: 10,
    description: 'Количество мест в ряду',
  })
  seats: number;
  @ApiProperty({
    example: 350,
    description: 'Цена билета',
  })
  price: number;
  @ApiProperty({
    type: [String],
    example: ['1:2', '1:3'],
    description: 'Список занятых мест в формате row:seat',
  })
  taken: string[];
}

export class FilmDto {
  @ApiProperty({
    example: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
    description: 'Идентификатор фильма',
  })
  id: string;
  @ApiProperty({ example: 8.7, description: 'Рейтинг фильма' })
  rating: number;
  @ApiProperty({ example: 'Итан Райт', description: 'Режиссёр фильма' })
  director: string;
  @ApiProperty({
    type: [String],
    example: ['Документальный'],
    description: 'Теги фильма',
  })
  tags: string[];
  @ApiProperty({
    example: 'Архитекторы общества',
    description: 'Название фильма',
  })
  title: string;
  @ApiProperty({ description: 'Короткое описание фильма' })
  about: string;
  @ApiProperty({ description: 'Полное описание фильма' })
  description: string;
  @ApiProperty({ example: '/bg1s.jpg', description: 'Постер фильма' })
  image: string;
  @ApiProperty({ example: '/bg1c.jpg', description: 'Обложка фильма' })
  cover: string;
}

export class FilmsListDto {
  @ApiProperty({ example: 6, description: 'Общее количество фильмов' })
  total: number;
  @ApiProperty({ type: [FilmDto], description: 'Список фильмов' })
  items: FilmDto[];
}

export class FilmScheduleDto {
  @ApiProperty({ example: 9, description: 'Общее количество сеансов' })
  total: number;
  @ApiProperty({ type: [ScheduleDto], description: 'Список сеансов фильма' })
  items: ScheduleDto[];
}
