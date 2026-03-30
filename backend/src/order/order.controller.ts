import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() order: CreateOrderDto) {
    return this.orderService.createOrder(order);
  }
}
