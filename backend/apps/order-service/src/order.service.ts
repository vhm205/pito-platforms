import {
  formatCurrency,
  generateRandomString,
  getDateTime,
  LoggerService,
  PLATFORM_FEE_RATE,
  transformFilterRule,
} from '@app/common';
import { AppConfig, Environment } from '@app/common/configs';
import {
  GrpcStatus,
  OrderStatusCode,
  PaymentGateway,
  CacheExpiry,
  ReadableOrderType,
  ReadablePaymentMethod,
  ReadableOrderStatus,
  PaymentPatternEvent,
  OrderErrorCode,
  VoucherType,
  StoreOrderStatus,
  SourceSystemType,
  ServiceFeeUnit,
  AppVersion,
} from '@app/common/enums';
import { OrderCreatedEvent } from '@app/common/events';
import { SlackService } from '@app/common/slack/slack.service';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  FindOrderRequest,
  FindOrdersRequest,
  OrderItem,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
} from '@app/common/types';
import { NullableType } from '@app/common/types/common';
import { OrderStatus } from '@app/common/types/proto/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RedisStore } from 'cache-manager-redis-yet';
import { isNumber } from 'lodash';
import type { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { BillingService } from './billing.service';
import { ORDER_CACHE_PREFIX } from './constants/order';
import { CartItem, Order, StoreOrder, StoreOrderItem, VatInfo } from './domain';
import { OrderMailPayload } from './dto';
import {
  Item,
  Option,
  RawChoice,
  RawOptionChoice,
  SelectedChoice,
  SelectedOption,
} from './dto/create-order.dto';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { PartnerRepository } from './infrastructure/persistence/partner.repository';
import { ShoppingSessionRepository } from './infrastructure/persistence/shopping-session.repository';
import { StoreRepository } from './infrastructure/persistence/store.repository';
import { OrderNotificationService } from './order-notification.service';
import { PromotionService } from './promotion.service';
import { StoreOrderService } from './store-order.service';

@Injectable()
export class OrderService {
  private readonly MIN_AMOUNT_PAY = 10_000;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly shoppingSessionRepository: ShoppingSessionRepository,
    private readonly partnerRepository: PartnerRepository,
    private readonly storeRepository: StoreRepository,
    private readonly storeOrderService: StoreOrderService,
    private readonly promotionService: PromotionService,
    private readonly billingService: BillingService,
    private readonly notificationService: OrderNotificationService,
    private readonly slackService: SlackService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: RedisStore,
    @Inject('PAYMENT_QUEUE') private readonly paymentQueue: ClientProxy,
  ) {}

  async createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    const {
      sessionId,
      userId,
      voucherIds,
      receiverName,
      receiverPhone,
      receiverEmail,
      deliveryDate,
      deliveryLater,
      deliveryAddress,
      orderType,
      paymentMethod,
      bankCode,
      note,
      introducerName,
      ipAddr,
      vatInfo,
      addressDetail,
      vnpayCallbackUrl,
      version,
    } = payload;

    const { session, cartItems } = await this.getCartSession(sessionId);
    const store = await this.getStoreById(session.storeId);

    const { storeId } = session;
    const shippingFee = isNaN(session.shippingFee) ? 0 : session.shippingFee;
    const { storeName, storeCode, partnerId } = store;
    const deliveryTime = getDateTime(deliveryDate).format('HH:mm');
    const orderId = uuidv4();

    const orderItems: OrderItem[] = this.getOrderItemsFromCartItems(cartItems);

    const subTotalPrice = this.calculateSubTotalPrice(orderItems);

    const { discountAmount, discountShippingFee } =
      await this.promotionService.calculateVoucherDiscount(
        userId,
        voucherIds,
        shippingFee,
        subTotalPrice,
      );

    const totalPrice = await this.calculateTotalPrice(
      subTotalPrice,
      shippingFee,
      discountAmount,
      discountShippingFee,
      version,
    );

    const orderCode = await this.generateOrderCode(
      storeId,
      storeCode,
      orderType as ReadableOrderType,
    );

    const { isPayLater, status, statusCode, errorCode } = this.checkPayLater(
      paymentMethod as ReadablePaymentMethod,
    );

    const order: Partial<Order> = {
      id: orderId,
      userId,
      partnerId,
      storeId,
      totalPrice,
      subTotalPrice,
      discountAmount,
      discountShippingFee,
      shippingFee,
      note,
      deliveryAddress,
      deliveryDate: getDateTime(deliveryDate).toDate(),
      deliveryTime,
      deliveryLater,
      orderCode,
      receiverName,
      receiverPhone,
      receiverEmail,
      orderItems,
      orderType: orderType as ReadableOrderType,
      paymentMethod: paymentMethod as ReadablePaymentMethod,
      status,
      statusCode,
      operatorStatusCode: statusCode,
      errorCode,
      metadata: {
        address_detail: addressDetail,
        introducer_name: introducerName,
        voucher_ids: voucherIds,
      },
      vatInfo: vatInfo as VatInfo,
    };

    const newOrder = await this.orderRepository.saveOrder(order);

    if (!newOrder) {
      throw new RpcException({
        code: GrpcStatus.FAILED_PRECONDITION,
        message: 'Create order failed',
      });
    }

    const orderMailPayload = await this.cacheEmailPayload(
      receiverName,
      receiverEmail,
      storeName,
      orderCode,
      totalPrice,
      subTotalPrice,
      shippingFee,
      discountShippingFee,
      discountAmount,
      voucherIds,
      orderItems,
    );

    if (isPayLater) {
      await Promise.allSettled([
        this.sendSlackMessageForNewOrder({ orderCode, totalPrice }),
        this.notificationService.sendOrderConfirmNotification({
          ...orderMailPayload,
        }),
      ]);

      return {
        totalPrice,
        orderCode,
        orderId,
        txId: '',
        txCode: '',
        paymentData: {
          state: ReadablePaymentMethod.PAY_LATER,
        },
      };
    }

    const { txId, txCode, paymentGateway } = await this.billingService.createTransaction({
      orderId,
      userId,
      storeId,
      amount: totalPrice,
      paymentMethod: paymentMethod as ReadablePaymentMethod,
      orderType: orderType as ReadableOrderType,
    });

    const { paymentState, paymentInfo, metadata } = await this.createPayment(
      paymentGateway as PaymentGateway,
      txId,
      userId,
      orderId,
      orderCode,
      totalPrice,
      bankCode,
      ipAddr,
      vnpayCallbackUrl,
    );

    this.paymentQueue.emit(
      PaymentPatternEvent.PAYMENT_INITIATED,
      new OrderCreatedEvent({
        txId,
        orderId,
        paymentMetadata: metadata,
      }),
    );

    return {
      totalPrice,
      orderCode,
      orderId,
      txId,
      txCode,
      paymentData: {
        ...paymentInfo,
        state: paymentState,
      },
    };
  }

  private checkPayLater(paymentMethod: ReadablePaymentMethod) {
    if (paymentMethod === ReadablePaymentMethod.PAY_LATER) {
      return {
        isPayLater: true,
        operatorStatusCode: OrderStatusCode.WAITING_FOR_DEPOSIT,
        statusCode: OrderStatusCode.WAITING_FOR_DEPOSIT,
        status: ReadableOrderStatus.WAITING_FOR_DEPOSIT,
        errorCode: OrderErrorCode.WAITING_FOR_DEPOSIT,
      };
    } else {
      return {
        isPayLater: false,
        operatorStatusCode: OrderStatusCode.DRAFT,
        statusCode: OrderStatusCode.DRAFT,
        status: ReadableOrderStatus.DRAFT,
        errorCode: OrderErrorCode.DRAFT,
      };
    }
  }

  private getSelectedOptions(
    item: Item,
    cartItem: { raw_options_choices?: RawOptionChoice[] },
  ): SelectedOption[] {
    const rawOptions = cartItem.raw_options_choices ?? [];

    return rawOptions.map(rawOption => {
      const { option_id: selectedOptionId, choices: rawChoices } = rawOption;
      const option = item.options_and_choices.find(opt => opt.option_id === selectedOptionId);

      if (!option) {
        throw new Error(`${item.name} does not have option with id ${selectedOptionId}`);
      }

      if (option.is_required && (!rawChoices || rawChoices.length === 0)) {
        throw new Error(`Option ${option.name} is required. You must select at least one choice.`);
      }

      const selectedChoices = rawChoices.map(rawChoice =>
        this.getChoiceSelected(rawChoice, option),
      );

      const totalQuantity = selectedChoices.reduce((sum, choice) => sum + choice.quantity, 0);

      if (option.is_required && totalQuantity !== option.max_choices) {
        throw new Error(`Option ${option.name} must have exactly ${option.max_choices} choices.`);
      }

      return {
        id: option.option_id,
        name: option.name,
        type: option.type,
        description: option.description,
        choices: selectedChoices,
      };
    });
  }

  private getChoiceSelected(rawChoice: RawChoice, option: Option): SelectedChoice {
    const { choice_id: rawChoiceId, quantity } = rawChoice;
    const choice = option.choices.find(ch => ch.choice_id === rawChoiceId);

    if (!choice) {
      throw new Error(`Option ${option.name} does not have choice with id ${rawChoiceId}`);
    }

    return {
      id: choice.choice_id,
      name: choice.name,
      basePrice: choice.base_price,
      quantity,
    };
  }

  private calculateSubTotalPrice(items: Array<{ totalPrice: number }>) {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  private async calculateTotalPrice(
    subTotalPrice: number,
    shippingFee: number,
    discountAmount: number,
    discountShippingFee: number,
    version: number,
  ) {
    if (isNaN(shippingFee)) {
      shippingFee = 0;
    }

    let totalPrice = discountShippingFee
      ? subTotalPrice - discountAmount + (shippingFee - discountShippingFee)
      : subTotalPrice - discountAmount + shippingFee;

    if (version === AppVersion.V2) {
      totalPrice = subTotalPrice - discountAmount;
    }

    if (totalPrice < 0) {
      totalPrice = 0;
    }

    return totalPrice;
  }

  private async generateOrderCode(
    storeId: string,
    storeCode: string,
    orderType: ReadableOrderType,
  ) {
    const orderCode = `${orderType}${storeCode}${generateRandomString(7)}`;
    const order = await this.orderRepository.findOne({ orderCode });

    if (order) {
      return this.generateOrderCode(storeId, storeCode, orderType);
    }

    return orderCode;
  }

  private async getCartSession(sessionId: string) {
    const [session, cartItems] = await Promise.all([
      this.shoppingSessionRepository.findOne({ id: sessionId }),
      this.shoppingSessionRepository.findCartItemsBySessionId(sessionId),
    ]);

    if (!session) {
      throw new RpcException({
        message: `Shopping session with ID ${sessionId} not found`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    if (!cartItems || cartItems.length === 0) {
      throw new RpcException({
        message: 'Cart is empty',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    return { session, cartItems };
  }

  private async getStoreById(storeId: string) {
    const store = await this.storeRepository.findOne({ id: storeId });
    if (!store) {
      throw new RpcException({
        message: `Store with ID ${storeId} not found`,
        status: GrpcStatus.NOT_FOUND,
      });
    }
    return store;
  }

  private getOrderItemsFromCartItems(cartItems: CartItem[]): OrderItem[] {
    return cartItems.map(item => ({
      item: {
        id: item.item?.id as string,
        name: item.item?.name as string,
        slug: item.item?.slug as string,
        images: item.item?.images as string[],
        basePrice: item.item?.basePrice as number,
        unitQuantity: item.item?.unitQuantity as number,
        optionsAndChoices:
          item.item?.optionsAndChoices?.map?.(option => {
            return {
              optionId: option.optionId,
              name: option.name,
              description: option.description,
              choices: option.choices.map(choice => ({
                choiceId: choice.choiceId,
                name: choice.name,
                basePrice: choice.basePrice,
                quantity: choice.quantity,
              })),
            };
          }) ?? [],
      },
      notes: item.notes as string,
      quantity: item.quantity,
      price: item.item?.basePrice as number,
      totalPrice: item.totalPrice,
      rawOptionsChoices: item.rawOptionsChoices.map(option => ({
        optionId: option.option_id,
        choices: option.choices.map(choice => ({
          quantity: choice.quantity,
          choiceId: choice.choice_id,
        })),
      })),
    }));
  }

  private async cacheEmailPayload(
    receiverName: string,
    receiverEmail: string,
    storeName: string,
    orderCode: string,
    totalPrice: number,
    subTotalPrice: number,
    shippingFee: number,
    discountShippingFee: number,
    discountAmount: number,
    voucherIds: string[],
    orderItems: OrderItem[],
  ) {
    let totalServicesAmount = 0,
      isServicePerson = false,
      isServiceTime = false;

    let serviceTime: Record<string, any> = {},
      servicePerson: Record<string, any> = {};

    const cartItemsMail = orderItems.map((item: any) => {
      const optionsAndChoices = this.getSelectedOptions(item.item, item);

      optionsAndChoices.forEach((opt: Record<string, any>) => {
        if (opt.type === 'service') {
          isServiceTime = true;
          serviceTime = opt.choices[0];
          totalServicesAmount += serviceTime.basePrice * serviceTime.quantity;
          serviceTime = {
            ...serviceTime,
            name: opt.name,
            basePrice: formatCurrency(serviceTime.basePrice),
          };
        }

        if (opt.type === 'person') {
          isServicePerson = true;
          servicePerson = opt.choices[0];
          totalServicesAmount += servicePerson.basePrice * servicePerson.quantity;
          servicePerson = {
            ...servicePerson,
            name: opt.name,
            basePrice: formatCurrency(servicePerson.basePrice),
          };
        }
      });

      const itemOptions = optionsAndChoices.filter((opt: Record<string, any>) => {
        if (opt.type !== 'service' && opt.type !== 'person') {
          return {
            option_name: opt.name,
            choices: opt.choices,
          };
        }
      });

      return {
        item_name: item.item?.name,
        item_amount: formatCurrency(item.price),
        count: item.quantity,
        notes: item.notes,
        item_options: itemOptions,
      };
    });

    const payload: OrderMailPayload = {
      user_name: receiverName,
      store_name: storeName,
      order_code: orderCode,
      order_time: getDateTime().format('HH:mm:ss DD/MM/YYYY'),
      total_sub_amount: formatCurrency(subTotalPrice),
      shipping_fee: formatCurrency(shippingFee),
      discount_shipping_fee: formatCurrency(discountShippingFee),
      voucher: formatCurrency(discountAmount),
      total_paid: formatCurrency(totalPrice),
      items: cartItemsMail,
      to: [receiverEmail],
      link: 'https://pito.vn/tim-kiem',
      voucher_ids: voucherIds,
      is_service_person: isServicePerson,
      is_service_time: isServiceTime,
      total_services_amount: formatCurrency(totalServicesAmount),
      service_time: serviceTime,
      service_person: servicePerson,
    };

    await Promise.all([
      this.cacheManager.set(
        `${ORDER_CACHE_PREFIX}:${orderCode}:cancel-expire`,
        payload,
        CacheExpiry.Minutes * 15,
      ),
      this.cacheManager.set(
        `${ORDER_CACHE_PREFIX}:${orderCode}:mail`,
        payload,
        CacheExpiry.Day * 7,
      ),
    ]);

    return payload;
  }

  async sendSlackMessageForNewOrder(payload: Record<string, string | number>) {
    const { orderCode, totalPrice } = payload;
    const nodeEnv = this.configService.get<AppConfig>('app.nodeEnv', {
      infer: true,
    });

    const slackOrderNotificationChannel =
      nodeEnv === Environment.PRODUCTION ? 'C076MPXALCX' : 'C079FQT9WMN';

    const domain: Record<string, string> = {
      development: 'https://partner-operator-dev.pito.vn',
      staging: 'https://partner-operator-stage.pito.vn',
      production: 'https://operator.pito.vn',
    };

    const orderDetailUrl = domain[nodeEnv].concat(`/don-hang/xpress/${orderCode}`);

    const slackResponse = await this.slackService.sendMessage(slackOrderNotificationChannel, {
      text: `<!here> Có một đơn hàng mới :package:\nMã đơn hàng <${orderDetailUrl}|*#${orderCode}*>\nGiá trị đơn hàng: \`${formatCurrency(
        totalPrice as number,
      )}\``,
    });

    this.logger.log('Slack notification sent successfully', {
      context: OrderService.name,
      trace: orderCode.toString(),
    });

    const threadKey = `slack:order:${orderCode}:thread_ts`;
    await this.cacheManager.set(threadKey, slackResponse.ts, CacheExpiry.Hour);
  }

  private async createPayment(
    paymentGateway: PaymentGateway,
    txId: string,
    userId: string,
    orderId: string,
    orderCode: string,
    totalPrice: number,
    bankCode: string,
    ipAddr: string,
    vnpayCallbackUrl: string,
  ) {
    let paymentState = 'init';
    let paymentInfo: Record<string, unknown> = {};
    let metadata = {};

    const currentDatetime = getDateTime().format();

    if (totalPrice >= this.MIN_AMOUNT_PAY) {
      switch (paymentGateway) {
        case PaymentGateway.ACB: {
          const response = await this.billingService.createAcbQrPayment({
            amount: totalPrice,
            txId,
            orderId,
            orderCode,
            userId,
          });

          paymentState = 'qrcode';
          paymentInfo = {
            qrCode: response.qrCode,
          };
          metadata = {
            [currentDatetime]: paymentInfo,
          };
          break;
        }
        case PaymentGateway.VNPAY: {
          const response = await this.billingService.createVnpayUrlPayment({
            amount: totalPrice,
            orderId,
            orderCode,
            bankCode,
            ipAddr,
            callbackUrl: vnpayCallbackUrl,
          });

          paymentState = 'redirect';
          paymentInfo = { paymentUrl: response.paymentUrl };
          metadata = {
            [currentDatetime]: paymentInfo,
          };
          break;
        }
        default:
          throw new RpcException({
            message: `Payment gateway not supported: ${paymentGateway}`,
            status: GrpcStatus.INVALID_ARGUMENT,
          });
      }
    } else {
      paymentState = 'done';
    }

    return { metadata, paymentState, paymentInfo };
  }

  async updateOrderToWaiting(order: Order) {
    order.status = ReadableOrderStatus.WAITING_FOR_CONFIRMATION;
    order.statusCode = OrderStatusCode.WAITING_FOR_CONFIRMATION;
    order.operatorStatusCode = OrderStatusCode.WAITING_FOR_CONFIRMATION;
    order.errorCode = OrderErrorCode.WAITING;
    order.updatedAt = getDateTime().toDate();

    const updatedOrder = await this.orderRepository.updateOrder(order);
    if (!updatedOrder) {
      throw new RpcException({
        message: `Failed to update order with ID ${order.id} to waiting`,
        status: GrpcStatus.INTERNAL,
      });
    }

    return updatedOrder;
  }

  async updateOrderToFailed(order: Order) {
    order.status = ReadableOrderStatus.PAYMENT_FAILED;
    order.statusCode = OrderStatusCode.PAYMENT_FAILED;
    order.operatorStatusCode = OrderStatusCode.PAYMENT_FAILED;
    order.errorCode = OrderErrorCode.PAYMENT_FAILED;
    order.updatedAt = getDateTime().toDate();

    const updatedOrder = await this.orderRepository.updateOrder(order);
    if (!updatedOrder) {
      throw new RpcException({
        message: `Failed to update order with ID ${order.id} to failed`,
        status: GrpcStatus.INTERNAL,
      });
    }

    return updatedOrder;
  }

  async removeShoppingCart(storeId: string, customerId: string) {
    const session = await this.shoppingSessionRepository.findOne({ storeId, customerId });
    if (session) {
      await this.shoppingSessionRepository.deleteShoppingSessionById(session.id);
    }
  }

  async updateNumberOfVoucherUses(userId: string, voucherIds?: string[]) {
    if (!Array.isArray(voucherIds) || voucherIds.length === 0) {
      return;
    }

    const vouchers = await this.promotionService.findVouchersByIds(voucherIds);

    const updateVouchersAsync = vouchers.map(voucher => {
      switch (voucher.type) {
        case VoucherType.ALL:
          return this.promotionService.incrementVoucherUsage({
            userId,
            voucherId: voucher.id,
          });
        case VoucherType.INDIVIDUAL:
          return this.promotionService.createUserVoucher({
            userId,
            voucherId: voucher.id,
            usageCount: 1,
          });
        default:
          return Promise.resolve();
      }
    });

    await Promise.all(updateVouchersAsync);
  }

  async createStoreOrder(order: Order) {
    const partner = await this.partnerRepository.findOne({ id: order.partnerId });
    const serviceFeeRate = partner?.serviceFeeRate || 20;
    const serviceFee = order.subTotalPrice * (serviceFeeRate / 100);
    const totalPrice = order.subTotalPrice - serviceFee;

    const orderItems: StoreOrderItem[] = order.orderItems.map(item => ({
      id: item.item?.id as string,
      name: item.item?.name as string,
      notes: item.notes as string,
      images: item.item?.images as string[],
      base_price: item.item?.basePrice as number,
      quantity: item.quantity as number,
      selected_options:
        item.item?.optionsAndChoices.map(option => ({
          name: option.name,
          selected_choices: option.choices.map(choice => {
            const choiceSelected = item.rawOptionsChoices
              .find(rawOption => rawOption.optionId === option.optionId)
              ?.choices.find(rawChoice => rawChoice.choiceId === choice.choiceId);

            return {
              name: choice.name,
              price: choice.basePrice,
              quantity: choiceSelected?.quantity ?? 0,
            };
          }),
        })) ?? [],
    }));

    // TODO: add metadata
    const storeOrder: Partial<StoreOrder> = {
      orderCode: order.orderCode,
      storeId: order.storeId,
      orderId: order.id,
      orderType: SourceSystemType.PX,
      notes: order.note,
      orderItems,

      totalPrice,
      subtotalPrice: order.subTotalPrice,
      shippingFee: order.shippingFee,
      serviceFee: {
        unit: ServiceFeeUnit.PERCENTAGE,
        unit_value: Number(serviceFeeRate) ?? PLATFORM_FEE_RATE,
        amount: Number(serviceFee),
      },

      status: StoreOrderStatus.PENDING,
      statusCode: OrderStatus.WAITING_FOR_CONFIRMATION,

      estimationTime: undefined,
      deliveryDate: order.deliveryDate,
      deliveryContact: {
        email: order.receiverEmail as string,
        phone: order.receiverPhone as string,
        full_name: order.receiverName as string,
      },
      deliveryAddress: {
        latitude: order.metadata?.addressDetail?.latitude,
        longitude: order.metadata?.addressDetail?.longitude,
        address: order.deliveryAddress,
        city: '', // will be updated later
        district: '', // will be updated later
        ward: '', // will be updated later
      },

      invoiceRequest: order.vatInfo
        ? {
            tax_code: order.vatInfo.taxCode as string,
            company_name: order.vatInfo.name as string,
            address: order.vatInfo.address as string,
            email: order.vatInfo.email as string,
          }
        : null,

      orderLogs: {
        confirmed_at: null,
        preparing_at: null,
        prepared_at: null,
        delivering_at: null,
        delivered_at: null,
        rejected_at: null,
        completed_at: null,
        not_confirmed_at: null,
        canceled_at: null,
        cancel_reasons: null,
      },
    };

    return this.storeOrderService.createStoreOrder(storeOrder);
  }

  async findOneOrder(payload: FindOrderRequest) {
    return this.orderRepository.findOne(payload);
  }

  async findOrderByFilter(
    payload: FindOptionsWhere<Pick<Order, 'id' | 'orderCode' | 'storeId' | 'statusCode'>>,
  ) {
    return this.orderRepository.findOne(payload);
  }

  async updateOrderStatus(payload: UpdateOrderStatusRequest): Promise<Order> {
    const { id, status, cancelReason, deliveryEta } = payload;
    const order = await this.orderRepository.findOne({ id }).then(order => order!); // Order must exist

    const timestamp = payload.timestamp ?? new Date();

    order.statusCode = status;
    order.operatorStatusCode = status;
    order.updatedAt = timestamp;

    if (cancelReason) order.cancelReason = cancelReason;

    switch (status) {
      case OrderStatus.PAYMENT_FAILED:
        order.status = ReadableOrderStatus.PAYMENT_FAILED;
        order.cancelReason ??= 'Thanh toán thất bại';
        break;
      case OrderStatus.CANCELED:
        // order.status = ReadableOrderStatus.CANCELED;
        order.cancelledAt = timestamp;
        break;
      case OrderStatus.REJECTED:
        // order.status = ReadableOrderStatus.REJECTED;
        order.cancelledAt = timestamp;
        break;
      case OrderStatus.CONFIRMED:
        // order.status = ReadableOrderStatus.CONFIRMED;
        order.confirmedAt = timestamp;
        break;
      case OrderStatus.PREPARING:
        // order.status = ReadableOrderStatus.PREPARING;
        order.preparingAt = timestamp;
        break;
      case OrderStatus.UNCONFIRMED:
        // order.status = ReadableOrderStatus.UNCONFIRMED;
        order.cancelledAt = timestamp;
        break;
      case OrderStatus.PREPARED:
        // order.status = ReadableOrderStatus.PREPARING; // TODO: change to PREPARED
        order.preparedAt = timestamp;
        break;
      case OrderStatus.DELIVERING:
        // order.status = ReadableOrderStatus.DELIVERING;
        order.deliveryAt = timestamp;
        order.deliveryEta = deliveryEta ?? null;
        break;
      case OrderStatus.DELIVERY_FAILED:
        // order.status = ReadableOrderStatus.DELIVERY_FAILED;
        order.deliveryFailedAt = timestamp;
        break;
      case OrderStatus.COMPLETED:
        // order.status = ReadableOrderStatus.COMPLETED;
        order.completedAt = timestamp;
        break;
    }

    const updatedOrder = await this.orderRepository.updateOrder(order);
    if (!updatedOrder) {
      throw new RpcException({
        message: `Failed to update order with ID ${order.id}`,
        status: GrpcStatus.INTERNAL,
      });
    }

    return updatedOrder;
  }

  async findAllOrders({ filters }: FindOrdersRequest): Promise<[Order[], number]> {
    return this.orderRepository
      .findAllOrders(filters.map(transformFilterRule))
      .then(orders => [orders, orders.length]);
  }

  async findOrdersWithPagination({
    pagination,
    filters,
    sorts,
  }: FindOrdersRequest): Promise<[Order[], number]> {
    return this.orderRepository.findOrdersWithPagination({
      pagination: pagination!,
      filters: filters.map(transformFilterRule),
      sorts,
    });
  }

  async updateOrder(request: UpdateOrderRequest): Promise<NullableType<Order>> {
    const order = await this.orderRepository.findOne({ id: request.id });
    if (!order) {
      throw new RpcException({
        message: `We could not find the order with id ${request.id}`,
        status: GrpcStatus.NOT_FOUND,
      });
    }

    const currentDateTime = new Date();

    if (request.statusCode) order.statusCode = request.statusCode;
    if (request.operatorStatusCode) order.operatorStatusCode = request.operatorStatusCode;
    // if (request.operationNotes)
    //   order.metadata = assign(order.metadata, { operationNotes: request.operationNotes });
    // if (request.changeLogs)
    //   order.metadata = assign(order.metadata, { changeLogs: request.changeLogs });
    if (isNumber(request.refundStatus)) {
      order.refundStatus = request.refundStatus;
      if (order.refundStatus) order.refundedAt = currentDateTime; // if refundStatus is equal to 1
    }
    if (request.metadata) order.metadata = request.metadata;

    order.updatedAt = currentDateTime;

    return this.orderRepository.updateOrder(order);
  }
}
