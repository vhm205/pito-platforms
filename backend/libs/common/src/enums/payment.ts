/**
 * PAYMENT
 */
export enum PaymentStatus {
  created = 'created',
  completed = 'completed',
  failed = 'failed',
  pending = 'pending',
  refunded = 'refunded',
}

export enum PaymentGateway {
  vnpay = 'vnpay',
  acb = 'acb',
}

export enum PaymentType {
  DP = 'DP', // direct payment
  AP = 'AP', // debt
  RF = 'RF', // refund
}

export enum ReadablePaymentMethod {
  QR_CODE = 'qrcode',
  ATM = 'atm',
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  JCB = 'jcb',
  UPI = 'upi',
  AMEX = 'amex',
}

export enum VNPayBankCodes {
  VNBANK = 'VNBANK',
  ATM = 'ATM',
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  JCB = 'JCB',
  UPI = 'UPI',
  AMEX = 'AMEX',
}

export enum TxErrorCode {
  init = 1000,
  success = 100,
  insufficient_funds = 401,
  invalid_card = 402,
  gateway_error = 403,
  tx_declined = 404,
  tx_timeout = 405,
  tx_cancelled = 406,
  unknow_error = 407,
  refund_error = 408,
  refund_rejected = 409,
  refunded = 500,
}
