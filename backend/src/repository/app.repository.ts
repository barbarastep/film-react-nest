import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto, OrderResultDto } from '../order/dto/order.dto';
import {
  FilmDto,
  FilmScheduleDto,
  ListResponseDto,
} from '../films/dto/films.dto';
import { FilmEntity } from '../entities/film.entity';
import { ScheduleEntity } from '../entities/schedule.entity';
import { FilmsRepository } from './films.repository';
import {
  DuplicateSeatInOrderError,
  FilmNotFoundError,
  SeatAlreadyTakenError,
  SessionNotFoundError,
} from './repository.errors';

@Injectable()
export class AppRepository implements FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmsRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async getFilms(): Promise<ListResponseDto<FilmDto>> {
    const items = (await this.filmsRepository.find()).map((film) =>
      this.toFilmDto(film),
    );

    return {
      total: items.length,
      items,
    };
  }

  async getFilmSchedule(id: string): Promise<ListResponseDto<FilmScheduleDto>> {
    const film = await this.filmsRepository.findOne({
      where: { id },
    });

    if (!film) {
      throw new FilmNotFoundError(id);
    }

    const schedule = await this.scheduleRepository.find({
      where: { filmId: id },
      order: { daytime: 'ASC' },
    });

    return {
      total: schedule.length,
      items: schedule.map((session) => this.toFilmScheduleDto(session)),
    };
  }

  async createOrder(
    order: CreateOrderDto,
  ): Promise<ListResponseDto<OrderResultDto>> {
    return this.dataSource.transaction(async (manager) => {
      const filmRepository = manager.getRepository(FilmEntity);
      const scheduleRepository = manager.getRepository(ScheduleEntity);
      const reservedSeats = new Set<string>();
      const lockedSessions = new Map<string, ScheduleEntity>();

      for (const ticket of order.tickets) {
        const film = await filmRepository.findOne({
          where: { id: ticket.film },
        });

        if (!film) {
          throw new FilmNotFoundError(ticket.film);
        }

        const session = await scheduleRepository
          .createQueryBuilder('schedule')
          .setLock('pessimistic_write')
          .where('schedule.id = :sessionId', { sessionId: ticket.session })
          .andWhere('schedule.filmId = :filmId', { filmId: ticket.film })
          .getOne();

        if (!session) {
          throw new SessionNotFoundError(ticket.session);
        }

        const seatKey = this.getSeatKey(ticket.row, ticket.seat);
        const taken = this.normalizeList(session.taken);

        if (taken.includes(seatKey)) {
          throw new SeatAlreadyTakenError(seatKey);
        }

        const reservationKey = `${ticket.session}:${seatKey}`;
        if (reservedSeats.has(reservationKey)) {
          throw new DuplicateSeatInOrderError(seatKey);
        }

        reservedSeats.add(reservationKey);
        lockedSessions.set(ticket.session, session);
      }

      for (const ticket of order.tickets) {
        const session = lockedSessions.get(ticket.session);

        if (!session) {
          throw new SessionNotFoundError(ticket.session);
        }

        const seatKey = this.getSeatKey(ticket.row, ticket.seat);
        session.taken = [...this.normalizeList(session.taken), seatKey];
      }

      await scheduleRepository.save([...lockedSessions.values()]);

      const items = order.tickets.map((ticket) => ({
        id: `${ticket.session}:${this.getSeatKey(ticket.row, ticket.seat)}`,
        ...ticket,
      }));

      return {
        total: items.length,
        items,
      };
    });
  }

  private toFilmDto(film: FilmEntity): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: this.normalizeList(film.tags),
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private toFilmScheduleDto(session: ScheduleEntity): FilmScheduleDto {
    return {
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: this.normalizeList(session.taken),
    };
  }

  private normalizeList(value: string[] | string | null | undefined): string[] {
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }

    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private getSeatKey(row: number, seat: number): string {
    return `${row}:${seat}`;
  }
}
