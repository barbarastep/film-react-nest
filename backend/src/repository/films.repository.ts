import { CreateOrderDto, OrderResultDto } from '../order/dto/order.dto';
import {
  FilmDto,
  FilmScheduleDto,
  ListResponseDto,
} from '../films/dto/films.dto';

export abstract class FilmsRepository {
  abstract getFilms(): Promise<ListResponseDto<FilmDto>>;
  abstract getFilmSchedule(
    id: string,
  ): Promise<ListResponseDto<FilmScheduleDto>>;
  abstract createOrder(
    order: CreateOrderDto,
  ): Promise<ListResponseDto<OrderResultDto>>;
}
