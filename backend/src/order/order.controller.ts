import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { CreateOrderDto, OrderResultDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(200)
  async createOrder(@Body() dto: CreateOrderDto): Promise<OrderResultDto> {
    return this.orderService.createOrder(dto);
  }
}
