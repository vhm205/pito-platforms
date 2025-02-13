/* eslint-disable */

export const protobufPackage = 'payment';

export interface CreateAcbQrPaymentRequest {
  txId: string;
  orderId: string;
  orderCode: string;
  amount: number;
  userId: string;
}

export interface CreateAcbQrPaymentResponse {
  qrCode: string;
}

export interface HandleIpnAcbRequest {
  requestDateTime: string;
  requestParameters: RequestParameters | undefined;
  requestTrace: string;
}

export interface HandleIpnAcbResponse {
  requestTrace: string;
  responseDateTime: string;
  responseStatus: HandleIpnAcbResponse_ResponseStatus | undefined;
  responseBody: HandleIpnAcbResponse_ResponseBody | undefined;
}

export interface HandleIpnAcbResponse_ResponseStatus {
  responseCode: string;
  responseMessage: string;
}

export interface HandleIpnAcbResponse_ResponseBody {
  index: number;
  referenceCode: string;
}

export interface RequestParameters {
  masterMeta: RequestParameters_MasterMeta | undefined;
  request: RequestParameters_Request | undefined;
}

export interface RequestParameters_RequestMeta {
  requestCode: string;
  requestType: string;
}

export interface RequestParameters_Request {
  requestMeta: RequestParameters_RequestMeta | undefined;
  requestParams: RequestParams | undefined;
}

export interface RequestParameters_MasterMeta {
  clientId: string;
  clientRequestId: string;
}

export interface RequestParams {
  pagination: RequestParams_Pagination | undefined;
  transactions: RequestParams_Transaction[];
}

export interface RequestParams_Pagination {
  page: number;
  pageSize: number;
  totalPage: number;
}

export interface RequestParams_Transaction {
  amount: number;
  debitOrCredit: string;
  effectiveDate: string;
  transactionChannel: string;
  transactionContent: string;
  transactionDate: string;
  transactionEntityAttribute: TransactionEntityAttribute | undefined;
  transactionStatus: string;
}

export interface TransactionEntityAttribute {
  beneficiaryName: string;
  custom1: string;
  custom2: string;
  custom3: string;
  custom4: string;
  traceNumber: string;
  virtualAccount: string;
}

export const PAYMENT_PACKAGE_NAME = 'payment';
