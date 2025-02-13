export class OrderCreatedEvent {
  txId: string;
  orderId: string;
  paymentMetadata: Record<string, unknown>;

  constructor(params: OrderCreatedEvent) {
    Object.assign(this, params);
  }
}
