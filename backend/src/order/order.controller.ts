import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { CreateOrderDto, OrderResultDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Бронирование билетов' })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Данные для создания заказа',
  })
  @ApiOkResponse({
    type: OrderResultDto,
    description: 'Заказ успешно создан',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Некорректные данные заказа или место уже занято',
    schema: {
      example: {
        error: 'Seat already taken',
      },
    },
  })
  async createOrder(@Body() dto: CreateOrderDto): Promise<OrderResultDto> {
    return this.orderService.createOrder(dto);
  }
}
