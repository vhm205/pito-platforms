import {
  BillingServiceController,
  BillingServiceControllerMethods,
  CreateTransactionRequest,
  CreateTransactionResponse,
  LoggerService,
} from '@app/common';
import { PaymentPatternEvent, PaymentStatus } from '@app/common/enums';
import { OrderCreatedEvent, PaymentTimeoutEvent } from '@app/common/events';
import {
  CreateAcbQrPaymentRequest,
  CreateAcbQrPaymentResponse,
  HandleIpnAcbRequest,
  HandleIpnAcbResponse,
} from '@app/common/types/proto/payment/acb';
import {
  CreateVnpayUrlPaymentRequest,
  CreateVnpayUrlPaymentResponse,
  HandleIpnVnpayRequest,
  HandleIpnVnpayResponse,
} from '@app/common/types/proto/payment/vnpay';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { BillingService } from './billing.service';

@Controller()
@BillingServiceControllerMethods()
export class BillingController implements BillingServiceController {
  constructor(
    private readonly logger: LoggerService,
    private readonly billingService: BillingService,
  ) {}

  createTransaction(args: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    return this.billingService.createTransaction(args);
  }

  createVnpayUrlPayment(args: CreateVnpayUrlPaymentRequest): CreateVnpayUrlPaymentResponse {
    return this.billingService.createVnpayUrlPayment(args);
  }

  async handleVnpayIpn(args: HandleIpnVnpayRequest): Promise<HandleIpnVnpayResponse> {
    return this.billingService.handleVnpayIpn(args);
  }

  async createAcbQrPayment(args: CreateAcbQrPaymentRequest): Promise<CreateAcbQrPaymentResponse> {
    return this.billingService.createAcbQrPayment(args);
  }

  async handleAcbIpn(args: HandleIpnAcbRequest): Promise<HandleIpnAcbResponse> {
    return this.billingService.handleAcbIpn(args);
  }

  @EventPattern(PaymentPatternEvent.PAYMENT_TIMEOUT)
  async transactionTimeout(@Ctx() context: RmqContext, @Payload() payload: PaymentTimeoutEvent) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log('PAYMENT TIMEOUT EVENT RECEIVED', {
      metadata: payload,
    });

    try {
      const { txId, orderId } = payload;

      const transaction = await this.billingService.findOneTransactionByFilter({
        id: txId,
        status: PaymentStatus.FAILED,
      });
      if (transaction) {
        throw new Error(`Transaction already exists ${txId}`);
      }

      await Promise.all([
        this.billingService.updateTransactionTimeout(txId),
        this.billingService.publishPaymentTimeoutEvent(txId, orderId),
      ]);

      this.logger.log('PAYMENT TIMEOUT EVENT PROCESSED', {
        metadata: payload,
      });

      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error((error as Error).message);
      channel.nack(originalMessage, false, false);
    }
  }

  @EventPattern(PaymentPatternEvent.PAYMENT_INITIATED)
  async paymentInitiated(@Ctx() context: RmqContext, @Payload() payload: OrderCreatedEvent) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log('PAYMENT INITIATED EVENT RECEIVED', {
      metadata: payload,
    });

    try {
      const { txId, orderId, paymentMetadata } = payload;

      const transaction = await this.billingService.findOneTransactionByFilter({
        id: txId,
      });
      if (!transaction) {
        throw new Error(`Transaction ${txId} not found`);
      }

      await Promise.all([
        this.billingService.updateTransaction({
          ...transaction,
          metadata: paymentMetadata,
        }),
        this.billingService.createSchedulerTxTimeout(txId, orderId),
      ]);

      this.logger.log('PAYMENT INITIATED EVENT PROCESSED', {
        metadata: payload,
      });

      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error((error as Error).message);
      channel.nack(originalMessage, false, false);
    }
  }
}
