export class OrderTicketDto {
  film: string;
  session: string;
  daytime: string;
  day: string;
  time: string;
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: OrderTicketDto[];
}

export class OrderResultDto extends OrderTicketDto {
  id: string;
}
