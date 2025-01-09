/* eslint-disable */

export const protobufPackage = 'payment';

export interface CreateVnpayUrlPaymentRequest {
  orderId: string;
  orderCode: string;
  amount: number;
  bankCode: string;
  locale: string;
  urlCallback: string;
}

export interface CreateVnpayUrlPaymentResponse {
  vnpayUrl: string;
}

export interface HandleIPNRequest {
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

export const PAYMENT_PACKAGE_NAME = 'payment';
