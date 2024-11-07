export class OrderItemDto {
  id: string;
  quantity: number;
}

export class CreateOrderDto {
  items: Array<OrderItemDto>;
}
