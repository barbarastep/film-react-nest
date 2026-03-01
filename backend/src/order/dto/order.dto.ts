export class CreateTicketDto {
  film: string;
  session: string;
  row: number;
  seat: number;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: CreateTicketDto[];
}

export class OrderedTicketDto extends CreateTicketDto {
  id: string;
  daytime: string;
  price: number;
}

export class OrderResultDto {
  total: number;
  items: OrderedTicketDto[];
}
