import { OrderStatus } from '@app/common/types/proto/common';

export enum OrderStatusCode {
  DRAFT = OrderStatus.DRAFT,
  PAYMENT_FAILED = OrderStatus.PAYMENT_FAILED,
  WAITING_FOR_CONFIRMATION = OrderStatus.WAITING_FOR_CONFIRMATION,
  CANCELED = OrderStatus.CANCELED,
  REJECTED = OrderStatus.REJECTED,
  CONFIRMED = OrderStatus.CONFIRMED,
  UNCONFIRMED = OrderStatus.UNCONFIRMED,
  PREPARING = OrderStatus.PREPARING,
  DELIVERING = OrderStatus.DELIVERING,
  DELIVERY_FAILED = OrderStatus.DELIVERY_FAILED,
  COMPLETED = OrderStatus.COMPLETED,
}

export enum OperatorOrderStatusCode {
  DRAFT = OrderStatus.DRAFT,
  PAYMENT_FAILED = OrderStatus.PAYMENT_FAILED,
  WAITING_FOR_CONFIRMATION = OrderStatus.WAITING_FOR_CONFIRMATION,
  CANCELED = OrderStatus.CANCELED,
  REJECTED = OrderStatus.REJECTED,
  CONFIRMED = OrderStatus.CONFIRMED,
  UNCONFIRMED = OrderStatus.UNCONFIRMED,
  PREPARING = OrderStatus.PREPARING,
  PREPARED = OrderStatus.PREPARED,
  DELIVERING = OrderStatus.DELIVERING,
  DELIVERY_FAILED = OrderStatus.DELIVERY_FAILED,
  COMPLETED = OrderStatus.COMPLETED,
}

export enum StoreOrderStatusCode {
  WAITING_FOR_CONFIRMATION = OrderStatus.WAITING_FOR_CONFIRMATION,
  CANCELED = OrderStatus.CANCELED,
  REJECTED = OrderStatus.REJECTED,
  CONFIRMED = OrderStatus.CONFIRMED,
  UNCONFIRMED = OrderStatus.UNCONFIRMED,
  PREPARING = OrderStatus.PREPARING,
  PREPARED = OrderStatus.PREPARED,
  COMPLETED = OrderStatus.COMPLETED,
}

export enum StoreOrderInvoiceStatus {
  NOT_REQUESTED = 0,
  REQUESTED_BUT_NOT_AVAILABLE = 1,
  REQUESTED_AND_AVAILABLE = 2,
}

export enum StoreOrderPaymentStatus {
  NOT_PAID = 0,
  PAID = 1,
  REFUNDED = 2,
}
