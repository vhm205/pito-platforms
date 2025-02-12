export class AcbQrPaymentTracePayload {
  txId: string;
  orderId: string;
  traceNumber: string;
  requestId: string;
  userId: string;
}

export class GenerateTokenProps {
  clientId: string;
  clientSecret: string;
  paymentGatewayUrl: string;
  paymentApiKey: string;
}
