export class PaymentSuccessEvent {
  txId: string;
  orderId: string;

  constructor(params: PaymentSuccessEvent) {
    Object.assign(this, params);
  }
}
