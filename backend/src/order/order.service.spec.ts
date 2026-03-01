import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { OrderService } from './order.service';
import { RepositoryService } from '../repository/repository.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let repository: RepositoryService;

  const freeSeatFilmId = '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf';
  const freeSeatSessionId = 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce';
  const preTakenFilmId = '5b70cb1a-61c9-47b1-b207-31f9e89087ff';
  const preTakenSessionId = '793009d6-030c-4dd4-8d13-9ba500724b38';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, RepositoryService],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<RepositoryService>(RepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('books a seat and stores it as row:seat', async () => {
    const order: CreateOrderDto = {
      email: 'student@example.com',
      phone: '+79990000000',
      tickets: [
        {
          film: freeSeatFilmId,
          session: freeSeatSessionId,
          row: 5,
          seat: 10,
        },
      ],
    };

    const result = await service.createOrder(order);
    const session = await repository.getSession(
      freeSeatFilmId,
      freeSeatSessionId,
    );

    expect(result.total).toBe(1);
    expect(result.items[0].film).toBe(freeSeatFilmId);
    expect(result.items[0].session).toBe(freeSeatSessionId);
    expect(session?.taken).toContain('5:10');
  });

  it('rejects duplicate seats in one order', async () => {
    const order: CreateOrderDto = {
      email: 'student@example.com',
      phone: '+79990000000',
      tickets: [
        {
          film: freeSeatFilmId,
          session: freeSeatSessionId,
          row: 4,
          seat: 9,
        },
        {
          film: freeSeatFilmId,
          session: freeSeatSessionId,
          row: 4,
          seat: 9,
        },
      ],
    };

    await expect(service.createOrder(order)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects already taken seat', async () => {
    const order: CreateOrderDto = {
      email: 'student@example.com',
      phone: '+79990000000',
      tickets: [
        {
          film: preTakenFilmId,
          session: preTakenSessionId,
          row: 1,
          seat: 3,
        },
      ],
    };

    await expect(service.createOrder(order)).rejects.toThrow(
      BadRequestException,
    );
  });
});
