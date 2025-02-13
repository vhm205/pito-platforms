import { BILLING_SERVICE, BILLING_SERVICE_NAME, BillingServiceClient } from '@app/common';
import {
  CreateAcbQrPaymentRequest,
  HandleIpnAcbRequest,
} from '@app/common/types/proto/payment/acb';
import {
  CreateVnpayUrlPaymentRequest,
  HandleIpnVnpayRequest,
} from '@app/common/types/proto/payment/vnpay';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { timeout, firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  private readonly TIMEOUT = 5000;
  private billingService: BillingServiceClient;

  constructor(@Inject(BILLING_SERVICE) private client: ClientGrpc) {
    this.billingService = this.client.getService<BillingServiceClient>(BILLING_SERVICE_NAME);
  }

  createVnpayUrlPayment(params: CreateVnpayUrlPaymentRequest) {
    const source$ = this.billingService.createVnpayUrlPayment(params).pipe(timeout(this.TIMEOUT));
    return firstValueFrom(source$);
  }

  handleVnpayIpn(params: HandleIpnVnpayRequest) {
    const source$ = this.billingService.handleVnpayIpn(params).pipe(timeout(this.TIMEOUT));
    return firstValueFrom(source$);
  }

  createAcbQrPayment(params: CreateAcbQrPaymentRequest) {
    const source$ = this.billingService.createAcbQrPayment(params).pipe(timeout(this.TIMEOUT));
    return firstValueFrom(source$);
  }

  handleAcbIpn(params: HandleIpnAcbRequest) {
    const source$ = this.billingService.handleAcbIpn(params).pipe(timeout(this.TIMEOUT));
    return firstValueFrom(source$);
  }
}
