/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  CreateAcbQrPaymentRequest,
  CreateAcbQrPaymentResponse,
  HandleIpnAcbRequest,
  HandleIpnAcbResponse,
} from './payment/acb';
import {
  CreateVnpayUrlPaymentRequest,
  CreateVnpayUrlPaymentResponse,
  HandleIpnVnpayRequest,
  HandleIpnVnpayResponse,
} from './payment/vnpay';

export const protobufPackage = 'billing';

export interface CreateTransactionRequest {
  orderId: string;
  amount: number;
  userId: string;
  paymentMethod: string;
  storeId: string;
  orderType: string;
}

export interface CreateTransactionResponse {
  txId: string;
  txCode: string;
  paymentGateway: string;
}

export interface Empty {}

export interface SuccessReponse {
  status: boolean;
}

export const BILLING_PACKAGE_NAME = 'billing';

export interface BillingServiceClient {
  createTransaction(request: CreateTransactionRequest): Observable<CreateTransactionResponse>;

  createVnpayUrlPayment(
    request: CreateVnpayUrlPaymentRequest,
  ): Observable<CreateVnpayUrlPaymentResponse>;

  handleVnpayIpn(request: HandleIpnVnpayRequest): Observable<HandleIpnVnpayResponse>;

  createAcbQrPayment(request: CreateAcbQrPaymentRequest): Observable<CreateAcbQrPaymentResponse>;

  handleAcbIpn(request: HandleIpnAcbRequest): Observable<HandleIpnAcbResponse>;
}

export interface BillingServiceController {
  createTransaction(
    request: CreateTransactionRequest,
  ):
    | Promise<CreateTransactionResponse>
    | Observable<CreateTransactionResponse>
    | CreateTransactionResponse;

  createVnpayUrlPayment(
    request: CreateVnpayUrlPaymentRequest,
  ):
    | Promise<CreateVnpayUrlPaymentResponse>
    | Observable<CreateVnpayUrlPaymentResponse>
    | CreateVnpayUrlPaymentResponse;

  handleVnpayIpn(
    request: HandleIpnVnpayRequest,
  ): Promise<HandleIpnVnpayResponse> | Observable<HandleIpnVnpayResponse> | HandleIpnVnpayResponse;

  createAcbQrPayment(
    request: CreateAcbQrPaymentRequest,
  ):
    | Promise<CreateAcbQrPaymentResponse>
    | Observable<CreateAcbQrPaymentResponse>
    | CreateAcbQrPaymentResponse;

  handleAcbIpn(
    request: HandleIpnAcbRequest,
  ): Promise<HandleIpnAcbResponse> | Observable<HandleIpnAcbResponse> | HandleIpnAcbResponse;
}

export function BillingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createTransaction',
      'createVnpayUrlPayment',
      'handleVnpayIpn',
      'createAcbQrPayment',
      'handleAcbIpn',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('BillingService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('BillingService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const BILLING_SERVICE_NAME = 'BillingService';
