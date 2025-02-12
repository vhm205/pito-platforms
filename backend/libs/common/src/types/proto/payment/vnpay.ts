/* eslint-disable */

export const protobufPackage = 'payment';

export interface CreateVnpayUrlPaymentRequest {
  orderId: string;
  orderCode: string;
  amount: number;
  bankCode: string;
  locale?: string | undefined;
  callbackUrl: string;
  ipAddr: string;
}

export interface CreateVnpayUrlPaymentResponse {
  paymentUrl: string;
}

export interface HandleIpnVnpayRequest {
  vnpAmount: string;
  vnpBankCode: string;
  vnpBankTranNo: string;
  vnpCardType: string;
  vnpOrderInfo: string;
  vnpPayDate: string;
  vnpResponseCode: string;
  vnpTmnCode: string;
  vnpTransactionNo: string;
  vnpTxnRef: string;
  vnpSecureHash: string;
  vnpTransactionStatus: string;
}

export interface HandleIpnVnpayResponse {
  RspCode: string;
  Message: string;
}

export const PAYMENT_PACKAGE_NAME = 'payment';
