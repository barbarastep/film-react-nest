import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';
import {
  DuplicateSeatInOrderError,
  FilmNotFoundError,
  SeatAlreadyTakenError,
  SessionNotFoundError,
} from '../repository/repository.errors';

@Injectable()
export class OrderService {
  constructor(private readonly repository: FilmsRepository) {}

  createOrder(order: CreateOrderDto) {
    this.validateOrder(order);

    return this.repository.createOrder(order).catch((error: unknown) => {
      if (error instanceof FilmNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof SessionNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof SeatAlreadyTakenError) {
        throw new ConflictException(error.message);
      }

      if (error instanceof DuplicateSeatInOrderError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    });
  }

  private validateOrder(order: CreateOrderDto): void {
    if (!Array.isArray(order.tickets) || order.tickets.length === 0) {
      throw new BadRequestException('Order must contain at least one ticket');
    }

    order.tickets.forEach((ticket, index) => {
      if (!this.isUuid(ticket.film)) {
        throw new UnprocessableEntityException(
          `Ticket at index ${index} contains an invalid film id`,
        );
      }

      if (!this.isUuid(ticket.session)) {
        throw new UnprocessableEntityException(
          `Ticket at index ${index} contains an invalid session id`,
        );
      }

      if (!Number.isInteger(ticket.row) || ticket.row <= 0) {
        throw new BadRequestException(
          `Ticket at index ${index} contains an invalid row`,
        );
      }

      if (!Number.isInteger(ticket.seat) || ticket.seat <= 0) {
        throw new BadRequestException(
          `Ticket at index ${index} contains an invalid seat`,
        );
      }
    });
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }
}
