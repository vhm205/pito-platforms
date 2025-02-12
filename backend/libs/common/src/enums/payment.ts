/**
 * PAYMENT
 */
export enum PaymentStatus {
  CREATED = 'created',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PENDING = 'pending',
  REFUNDED = 'refunded',
}

export enum PaymentGateway {
  VNPAY = 'vnpay',
  ACB = 'acb',
}

export enum PaymentType {
  DP = 'DP', // direct payment
  AP = 'AP', // debt
  RF = 'RF', // refund
}

export enum ReadablePaymentMethod {
  PAY_LATER = 'pay_later',
  QR_CODE = 'qrcode',
  ATM = 'atm',
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  JCB = 'jcb',
  UPI = 'upi',
  AMEX = 'amex',
}

export enum PaymentMethod {
  PAY_LATER = 'pay_later',
  QR_CODE = 'qrcode',
  ATM = 'atm',
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  JCB = 'jcb',
  UPI = 'upi',
  AMEX = 'amex',
}

export enum VnpayBankCode {
  VNBANK = 'VNBANK',
  ATM = 'ATM',
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  JCB = 'JCB',
  UPI = 'UPI',
  AMEX = 'AMEX',
}

export enum VnpayLocale {
  VN = 'vn',
  EN = 'en',
}

export enum TxErrorCode {
  INIT = 1000,
  SUCCESS = 100,
  INSUFFICIENT_FUNDS = 401,
  INVALID_CARD = 402,
  GATEWAY_ERROR = 403,
  TX_DECLINED = 404,
  TX_TIMEOUT = 405,
  TX_CANCELLED = 406,
  UNKNOW_ERROR = 407,
  REFUND_ERROR = 408,
  REFUND_REJECTED = 409,
  REFUNDED = 500,
}

export enum PaymentPatternEvent {
  PAYMENT_INITIATED = 'payment.tx.initiated',
  PAYMENT_TIMEOUT = 'payment.tx.timeout',
}
