import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    example: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
    description: 'Идентификатор фильма',
  })
  film: string;
  @ApiProperty({
    example: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
    description: 'Идентификатор сеанса',
  })
  session: string;
  @ApiProperty({ example: 2, description: 'Номер ряда' })
  row: number;
  @ApiProperty({ example: 5, description: 'Номер места' })
  seat: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 'student@example.com',
    description: 'Email покупателя',
  })
  email: string;
  @ApiProperty({ example: '+79990000000', description: 'Телефон покупателя' })
  phone: string;
  @ApiProperty({
    type: [CreateTicketDto],
    description: 'Список билетов для бронирования',
  })
  tickets: CreateTicketDto[];
}

export class OrderedTicketDto extends CreateTicketDto {
  @ApiProperty({
    example: '8d5f9d8f-5f76-4f3e-b454-6fb4ddf61212',
    description: 'Идентификатор созданного билета',
  })
  id: string;
  @ApiProperty({
    example: '2024-06-28T10:00:53+03:00',
    description: 'Дата и время сеанса',
  })
  daytime: string;
  @ApiProperty({ example: 350, description: 'Цена билета' })
  price: number;
}

export class OrderResultDto {
  @ApiProperty({
    example: 2,
    description: 'Общее количество забронированных билетов',
  })
  total: number;
  @ApiProperty({
    type: [OrderedTicketDto],
    description: 'Список созданных билетов',
  })
  items: OrderedTicketDto[];
}
