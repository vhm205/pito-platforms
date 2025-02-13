export class PaymentFailedEvent {
  txId: string;
  orderId: string;

  constructor(params: PaymentFailedEvent) {
    Object.assign(this, params);
  }
}
