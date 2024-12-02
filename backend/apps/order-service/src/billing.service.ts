import {
  BILLING_SERVICE,
  BILLING_SERVICE_NAME,
  BillingServiceClient,
  CreateTransactionRequest,
} from '@app/common';
import { CreateAcbQrPaymentRequest } from '@app/common/types/proto/payment/acb';
import { CreateVnpayUrlPaymentRequest } from '@app/common/types/proto/payment/vnpay';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, retry, timeout } from 'rxjs';

@Injectable()
export class BillingService {
  private billingService: BillingServiceClient;

  constructor(@Inject(BILLING_SERVICE) private billingClient: ClientGrpc) {
    this.billingService = this.billingClient.getService<BillingServiceClient>(BILLING_SERVICE_NAME);
  }

  createTransaction(request: CreateTransactionRequest) {
    const source$ = this.billingService
      .createTransaction(request)
      .pipe(timeout(3000))
      .pipe(retry(3));
    return firstValueFrom(source$);
  }

  createVnpayUrlPayment(request: CreateVnpayUrlPaymentRequest) {
    const source$ = this.billingService
      .createVnpayUrlPayment(request)
      .pipe(retry(3))
      .pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  createAcbQrPayment(request: CreateAcbQrPaymentRequest) {
    const source$ = this.billingService
      .createAcbQrPayment(request)
      .pipe(timeout(10000))
      .pipe(retry(3));
    return firstValueFrom(source$);
  }
}
