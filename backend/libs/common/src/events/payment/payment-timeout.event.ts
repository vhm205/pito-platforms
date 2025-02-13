export class PaymentTimeoutEvent {
  txId: string;
  orderId: string;

  constructor(params: PaymentTimeoutEvent) {
    Object.assign(this, params);
  }
}
