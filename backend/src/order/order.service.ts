import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { RepositoryService } from '../repository/repository.service';
import {
  CreateOrderDto,
  OrderResultDto,
  OrderedTicketDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly repositoryService: RepositoryService) {}

  async createOrder(order: CreateOrderDto): Promise<OrderResultDto> {
    this.validateOrderBody(order);

    const bookingSet = new Set<string>();
    const resolvedTickets: OrderedTicketDto[] = [];

    for (const ticket of order.tickets) {
      const session = await this.repositoryService.getSession(
        ticket.film,
        ticket.session,
      );

      if (!session) {
        throw new NotFoundException({ error: 'Film session not found' });
      }

      if (
        !Number.isInteger(ticket.row) ||
        !Number.isInteger(ticket.seat) ||
        ticket.row < 1 ||
        ticket.seat < 1
      ) {
        throw new BadRequestException({ error: 'Invalid row/seat value' });
      }

      if (ticket.row > session.rows || ticket.seat > session.seats) {
        throw new BadRequestException({ error: 'Seat is out of hall bounds' });
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;
      const bookingKey = `${ticket.film}:${ticket.session}:${seatKey}`;

      if (bookingSet.has(bookingKey)) {
        throw new BadRequestException({
          error: 'Duplicate seats in one order are not allowed',
        });
      }

      if (session.taken.includes(seatKey)) {
        throw new BadRequestException({ error: 'Seat already taken' });
      }

      bookingSet.add(bookingKey);
      resolvedTickets.push({
        id: randomUUID(),
        film: ticket.film,
        session: ticket.session,
        daytime: session.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: session.price,
      });
    }

    const reservedSeats: Array<{
      filmId: string;
      sessionId: string;
      seatKey: string;
    }> = [];
    for (const ticket of resolvedTickets) {
      const seatKey = `${ticket.row}:${ticket.seat}`;
      const reserved = await this.repositoryService.addTakenSeat(
        ticket.film,
        ticket.session,
        seatKey,
      );
      if (!reserved) {
        for (const reservedSeat of reservedSeats) {
          await this.repositoryService.removeTakenSeat(
            reservedSeat.filmId,
            reservedSeat.sessionId,
            reservedSeat.seatKey,
          );
        }
        throw new BadRequestException({ error: 'Seat already taken' });
      }

      reservedSeats.push({
        filmId: ticket.film,
        sessionId: ticket.session,
        seatKey,
      });
    }

    return {
      total: resolvedTickets.length,
      items: resolvedTickets,
    };
  }

  private validateOrderBody(order: CreateOrderDto): void {
    if (!order || !Array.isArray(order.tickets) || order.tickets.length === 0) {
      throw new BadRequestException({ error: 'Tickets are required' });
    }

    if (typeof order.email !== 'string' || typeof order.phone !== 'string') {
      throw new BadRequestException({ error: 'Email and phone are required' });
    }
  }
}
