import {
  getCurrentDateTime,
  RabbitMQService,
  RabbitMQExchange,
  LoggerService,
  CreateTransactionRequest,
} from '@app/common';
import { AllConfigType } from '@app/common/configs';
import {
  CacheExpiry,
  DelayTime,
  OrderPatternEvent,
  PaymentGateway,
  PaymentPatternEvent,
  PaymentStatus,
  PaymentType,
  ReadableOrderType,
  ReadablePaymentMethod,
  TxErrorCode,
  VnpayBankCode,
  VnpayLocale,
} from '@app/common/enums';
import { PaymentFailedEvent, PaymentSuccessEvent, PaymentTimeoutEvent } from '@app/common/events';
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as amqp from 'amqplib';
import { RedisStore } from 'cache-manager-redis-yet';
import * as dayjs from 'dayjs';
import type { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ACB_CACHE_PREFIX } from './constants/acb.constant';
import {
  vnpayResponse,
  VnpayResponseCodes,
  VnpayResponseCodesDescription,
} from './constants/vnpay.constant';
import { Transaction } from './domain/transaction.domain';
import { AcbQrPaymentTracePayload, GenerateTokenProps } from './dtos/acb.dto';
import { TransactionRepository } from './infrastructure/persistence/transaction.repository';
import { generateToken } from './utils/acb.util';
import { generateTxCode } from './utils/transaction.util';
import { checkVnpayResponseValid, hashSha512, sortObject } from './utils/vnpay.util';

@Injectable()
export class BillingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly txRepository: TransactionRepository,
    private readonly queue: RabbitMQService,
    private readonly logger: LoggerService,
    @Inject('RABBITMQ_CONNECTION') private readonly connection: amqp.Connection,
    @Inject(CACHE_MANAGER) private readonly cacheManager: RedisStore,
    @Inject('ORDER_QUEUE') private readonly orderQueue: ClientProxy,
  ) {
    this.queue.createChannel(this.connection);
  }

  async createTransaction(payload: CreateTransactionRequest) {
    const { orderId, amount, paymentMethod, userId, storeId, orderType } = payload;

    const paymentGateway =
      paymentMethod === ReadablePaymentMethod.QR_CODE ? PaymentGateway.ACB : PaymentGateway.VNPAY;
    const txCode = await this.createTxCode(orderType as ReadableOrderType);

    const newTransaction = await this.txRepository.createTransaction({
      txCode,
      orderId,
      storeId,
      amount: +amount,
      customerId: userId,
      description: 'Thanh toan don hang',
      status: PaymentStatus.CREATED,
      paymentType: PaymentType.AP,
      paymentMethod: paymentMethod as ReadablePaymentMethod,
      paymentGateway,
      statusMessage: 'Initialized',
      errorCode: TxErrorCode.INIT,
    });

    if (!newTransaction) {
      throw new RpcException('Create transaction failed');
    }

    return {
      txId: newTransaction.id,
      txCode: newTransaction.txCode,
      paymentGateway: newTransaction.paymentGateway,
    };
  }

  async updateTransaction(payload: Partial<Transaction>) {
    return this.txRepository.updateTransaction(payload);
  }

  async findOneTransactionByFilter(
    filter: FindOptionsWhere<Pick<Transaction, 'id' | 'orderId' | 'status' | 'txCode'>>,
  ) {
    const transaction = await this.txRepository.findOne(filter);

    if (!transaction) {
      throw new RpcException('Transaction not found');
    }

    return transaction;
  }

  async publishPaymentTimeoutEvent(txId: string, orderId: string) {
    this.orderQueue.emit(
      OrderPatternEvent.PAYMENT_TIMEOUT,
      new PaymentTimeoutEvent({
        txId,
        orderId,
      }),
    );
  }

  async createSchedulerTxTimeout(txId: string, orderId: string) {
    this.queue.publishToExchange(
      RabbitMQExchange.DELAYED_EXCHANGE,
      PaymentPatternEvent.PAYMENT_TIMEOUT,
      {
        pattern: PaymentPatternEvent.PAYMENT_TIMEOUT,
        data: new PaymentTimeoutEvent({
          txId,
          orderId,
        }),
      },
      {
        headers: { 'x-delay': DelayTime.Minute * 15 },
      },
    );
  }

  private async createTxCode(orderType: ReadableOrderType) {
    const txCode = generateTxCode(orderType);
    const transaction = await this.txRepository.findOne({ txCode });

    if (transaction) {
      return this.createTxCode(orderType);
    }

    return txCode;
  }

  createVnpayUrlPayment(payload: CreateVnpayUrlPaymentRequest): CreateVnpayUrlPaymentResponse {
    const { orderId, orderCode, amount, bankCode, locale, callbackUrl, ipAddr } = payload;
    const { paymentUrl, tmnCode, secretKey, tmnCodeInternational, secretKeyInternational } =
      this.configService.getOrThrow<AllConfigType>('external.vnpay', {
        infer: true,
      });

    const date = new Date();
    const vnpTxnRef = orderId;
    const vnpCreateDate = date.toISOString().slice(0, 19).replace(/[-:T]/g, '');
    const returnUrl = callbackUrl.replace(/\{orderId\}/g, orderId);

    const international: string[] = [
      VnpayBankCode.VISA,
      VnpayBankCode.MASTERCARD,
      VnpayBankCode.JCB,
      VnpayBankCode.UPI,
      VnpayBankCode.AMEX,
    ];

    const vnpaySecret = international.includes(bankCode) ? secretKeyInternational : secretKey;
    const vnpayTmnCode = international.includes(bankCode) ? tmnCodeInternational : tmnCode;

    let vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayTmnCode,
      vnp_Amount: amount * 100,
      vnp_BankCode: bankCode,
      vnp_CreateDate: vnpCreateDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: ipAddr,
      vnp_Locale: locale || VnpayLocale.VN,
      vnp_OrderInfo: `Thanh toan don hang Catering PITO ${orderCode}`,
      vnp_OrderType: 'billpayment',
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: vnpTxnRef,
    };

    vnpParams = sortObject(vnpParams);

    // Create secure hash
    const searchParams = new URLSearchParams(vnpParams as any);
    const signData = searchParams.toString();
    const secureHash = hashSha512(signData, vnpaySecret!);
    searchParams.append('vnp_SecureHash', secureHash);

    // Create payment URL
    const vnpayPaymentUrl = `${paymentUrl}?${searchParams.toString()}`;

    return { paymentUrl: vnpayPaymentUrl };
  }

  async handleVnpayIpn(payload: HandleIpnVnpayRequest): Promise<HandleIpnVnpayResponse> {
    const { tmnCode, secretKey, secretKeyInternational } = this.configService.get<AllConfigType>(
      'external.vnpay',
      {
        infer: true,
      },
    );
    const currentDate = getCurrentDateTime();
    const orderId = payload['vnpTxnRef'];
    const vnp_Amount = payload['vnpAmount'];
    const vnp_TmnCode = payload['vnpTmnCode'];
    const vnp_TransactionStatus = payload['vnpTransactionStatus'];
    const vnp_ResponseCode = payload['vnpResponseCode'];

    const secret = tmnCode === vnp_TmnCode ? secretKey : secretKeyInternational;

    const isVNPayResponseValid = checkVnpayResponseValid(payload, secret);

    if (!isVNPayResponseValid) {
      this.logger.error('Vnpay Checksum error', {
        metadata: payload,
      });
      return vnpayResponse.checksumError;
    }

    const transaction = await this.txRepository.findOne({ orderId, status: PaymentStatus.CREATED });
    if (!transaction) {
      this.logger.error(
        `Transaction not found with order id ${orderId} and status ${PaymentStatus.CREATED}`,
      );
      return vnpayResponse.orderNotFound;
    }

    const vnpAmount = parseInt(vnp_Amount) / 100;
    if (transaction.amount !== vnpAmount) {
      this.logger.error('Amount invalid', {
        metadata: { vnpAmount, transactionAmount: transaction.amount },
      });
      return vnpayResponse.invalidAmount;
    }

    if (transaction.status === PaymentStatus.COMPLETED) {
      this.logger.error('Transaction already confirmed', {
        metadata: { status: transaction.status, txId: transaction.id },
      });
      return vnpayResponse.orderAlreadyConfirmed;
    }

    // Payment failed
    if (vnp_TransactionStatus !== '00' || vnp_ResponseCode !== '00') {
      await this.updateTransactionFailed(transaction.id, {
        statusMessage: VnpayResponseCodesDescription[vnp_ResponseCode] ?? 'Unknown error',
        metadata: {
          ...transaction.metadata,
          [currentDate]: payload,
        },
      });

      this.orderQueue.emit(
        OrderPatternEvent.PAYMENT_FAILED,
        new PaymentFailedEvent({
          txId: transaction.id,
          orderId,
        }),
      );
    } else {
      await this.updateTransactionSuccess(transaction.id, {
        statusMessage: VnpayResponseCodes.success.message,
        metadata: {
          ...transaction.metadata,
          [currentDate]: payload,
        },
      });

      this.orderQueue.emit(
        OrderPatternEvent.PAYMENT_SUCCESS,
        new PaymentSuccessEvent({
          txId: transaction.id,
          orderId,
        }),
      );
    }

    return vnpayResponse.success;
  }

  async createAcbQrPayment(
    payload: CreateAcbQrPaymentRequest,
  ): Promise<CreateAcbQrPaymentResponse> {
    const { acb: acbConfig, gcp: gcpConfig } = this.configService.get<AllConfigType>('external', {
      infer: true,
    });
    const { clientId, clientSecret, ownerNumber, va, providerId } = acbConfig;
    const { paymentGatewayUrl, paymentApiKey } = gcpConfig;
    const { txId, orderCode, orderId, userId } = payload;

    const token = await this.getAcbToken({
      clientId,
      clientSecret,
      paymentGatewayUrl,
      paymentApiKey,
    });

    const requestId = uuidv4();
    const requestTrace = uuidv4();
    const traceNumber = txId;

    // Date format: "2024-05-17T17:30:24.116+0700"
    const requestDateTime = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZZ');

    // - merchantid: theo từng cửa hàng
    // - terminalid: theo từng quầy/máy tính tiền/mục đích thanh toán
    // - orderID:
    // Giới hạn từ 13 ký tự trở xuống, nó sẽ là phần đuôi của Virtualaccount
    // Virtual account bên c tối đa 18 ký tự (bao gồm 3 ký tự đầu số VA-VirtualPrefix,
    // 2 ký tự cố định là MS, 13 ký tự sau cùng dành cho orderid map qua)

    const query = {
      Authorization: `Bearer ${token}`,
      'X-Client-Id': clientId,
      'X-Owner-Number': ownerNumber,
      'X-Owner-Type': 'ORG',
      'X-Provider-Id': providerId,
      'X-Request-Id': requestId,
      'X-Service': 'QRPAYMENT',
    };

    const payloadCreateQR = {
      requestDateTime,
      requestParameters: {
        amount: 20_0000,
        description: `THANH TOAN DON HANG ${orderCode}`,
        beneficiaryName: 'CTY CO PHAN PITO',
        orderId: orderCode,
        traceNumber,
        userId,
        virtualAccountPrefix: va,
      },
      requestTrace,
    };
    const urlSearchParams = new URLSearchParams(query);
    const queryString = urlSearchParams.toString();

    const result = await fetch(`${paymentGatewayUrl}/acb/generate-qr?${queryString}`, {
      method: 'POST',
      body: JSON.stringify(payloadCreateQR),
      headers: {
        'payment-pitovn-api-key': paymentApiKey,
      },
    });

    const response = await result.json();
    const qrCodeData = response?.responseBody?.qrDataUrl;

    if (!qrCodeData) {
      throw new RpcException('Create QR code error');
    }

    await this.cacheAcbQrPaymentRequest(orderCode, {
      txId,
      orderId,
      traceNumber,
      requestId,
      userId,
    });

    return { qrCode: qrCodeData };
  }

  private async getAcbToken(payload: GenerateTokenProps) {
    const cacheKey = `${ACB_CACHE_PREFIX}:jwt`;
    let token = await this.cacheManager.get(cacheKey);

    if (!token) {
      // Get token from ACB
      const acbToken = await generateToken(payload);
      if (!acbToken || !acbToken.access_token) {
        throw new RpcException('Get ACB token error');
      }

      token = acbToken.access_token;
      await this.cacheManager.set(cacheKey, acbToken.access_token, acbToken.expires_in);
    }

    return token;
  }

  private async cacheAcbQrPaymentRequest(orderCode: string, payload: AcbQrPaymentTracePayload) {
    const cacheKey = `${ACB_CACHE_PREFIX}:qr:${orderCode}`;
    await this.cacheManager.set(cacheKey, payload, CacheExpiry.Minutes * 15);
  }

  async handleAcbIpn(payload: HandleIpnAcbRequest): Promise<HandleIpnAcbResponse> {
    // Cache ACB request for future tracing
    await this.cacheAcbQrPaymentResult(payload);

    const currentDate = getCurrentDateTime();
    const { requestMeta, requestParams } = payload.requestParameters!.request!;
    const { transactionStatus, amount } = requestParams!.transactions[0];
    const responseDateTime = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'); // "2023-12-14T11:03:33.033+0700"

    if (requestMeta!.requestCode === 'TRANSACTION_UPDATE') {
      const txTrace = await this.checkAcbQrPaymentRequest(payload);

      const transaction = await this.txRepository.findOne({
        id: txTrace.txId,
        status: PaymentStatus.CREATED,
      });
      if (!transaction) {
        throw new RpcException('Transaction not found');
      }

      if (transaction.amount !== amount) {
        throw new RpcException('Amount invalid');
      }

      // Update transaction status
      if (transactionStatus === 'COMPLETED') {
        await this.updateTransactionSuccess(transaction.id, {
          metadata: {
            ...transaction.metadata,
            [currentDate]: payload,
          },
        });

        this.orderQueue.emit(
          OrderPatternEvent.PAYMENT_SUCCESS,
          new PaymentSuccessEvent({
            txId: transaction.id,
            orderId: transaction.orderId,
          }),
        );
      } else {
        await this.updateTransactionFailed(transaction.id, {
          metadata: {
            ...transaction.metadata,
            [currentDate]: payload,
          },
        });

        this.orderQueue.emit(
          OrderPatternEvent.PAYMENT_FAILED,
          new PaymentFailedEvent({
            txId: transaction.id,
            orderId: transaction.orderId,
          }),
        );
      }

      // Remove cache acb qr payment request
      this.cacheManager.del(`${ACB_CACHE_PREFIX}:qr:${txTrace.orderCode}`);
    }

    // Response follow format of ACB
    return {
      requestTrace: payload.requestTrace,
      responseDateTime,
      responseStatus: {
        responseCode: '00000000',
        responseMessage: 'Success',
      },
      responseBody: {
        index: 1,
        referenceCode: '123456',
      },
    };
  }

  private async updateTransactionSuccess(txId: string, payload: Record<string, any>) {
    const currentDate = getCurrentDateTime();
    await this.txRepository.updateTransaction({
      id: txId,
      statusMessage: 'Thanh toán thành công',
      updatedAt: currentDate,
      status: PaymentStatus.COMPLETED,
      errorCode: TxErrorCode.SUCCESS,
      ...payload,
    });
  }

  private async updateTransactionFailed(txId: string, payload: Record<string, any>) {
    const currentDate = getCurrentDateTime();
    await this.txRepository.updateTransaction({
      id: txId,
      statusMessage: `Thanh toán thất bại`,
      updatedAt: currentDate,
      status: PaymentStatus.FAILED,
      errorCode: TxErrorCode.UNKNOW_ERROR,
      ...payload,
    });
  }

  async updateTransactionTimeout(txId: string) {
    const currentDate = getCurrentDateTime();
    await this.txRepository.updateTransaction({
      id: txId,
      statusMessage: 'Hết hạn thanh toán',
      updatedAt: currentDate,
      status: PaymentStatus.FAILED,
      errorCode: TxErrorCode.TX_TIMEOUT,
    });
  }

  private async cacheAcbQrPaymentResult(payload: HandleIpnAcbRequest) {
    const currentDate = getCurrentDateTime();
    const cacheKey = `${ACB_CACHE_PREFIX}:history:${currentDate}`;
    await this.cacheManager.set(cacheKey, payload, CacheExpiry.Month * 6);
  }

  private async getTxTraceByOrderCode(orderCode: string) {
    const cacheKey = `${ACB_CACHE_PREFIX}:qr:${orderCode}`;
    const txTrace: AcbQrPaymentTracePayload | undefined = await this.cacheManager.get(cacheKey);
    return txTrace;
  }

  private async checkAcbQrPaymentRequest(payload: HandleIpnAcbRequest) {
    const { request } = payload.requestParameters!;
    const { requestParams } = request!;
    const { transactionEntityAttribute } = requestParams!.transactions[0];
    const { custom4: orderCode, custom3: userId, traceNumber } = transactionEntityAttribute!;

    const txTrace = await this.getTxTraceByOrderCode(orderCode);
    if (!txTrace) {
      throw new RpcException('Transaction not found');
    }

    if (txTrace.userId !== userId || txTrace.traceNumber !== traceNumber) {
      throw new RpcException('Acb IPN request invalid');
    }

    return { ...txTrace, orderCode };
  }
}
