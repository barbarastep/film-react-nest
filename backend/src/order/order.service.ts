import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly repository: FilmsRepository) {}

  createOrder(order: CreateOrderDto) {
    return this.repository.createOrder(order);
  }
}
