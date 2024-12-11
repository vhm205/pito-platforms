export enum ReadableOrderStatus {
  DRAFT = 'draft',
  PAYMENT_FAILED = 'payment_failed',
  WAITING_FOR_CONFIRMATION = 'waiting',
  CANCELED = 'canceled',
  REJECTED = 'rejected',
  UNCONFIRMED = 'unconfirmed',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  DELIVERING = 'delivering',
  DELIVERY_FAILED = 'delivery_failed',
  COMPLETED = 'completed',
}

export enum ReadableStoreOrderStatus {
  created = 'created',
  processing = 'processing',
  canceled = 'canceled',
  rejected = 'rejected',
  missed = 'missed',
  prepared = 'prepared',
  completed = 'completed',
}

export enum StoreOrderStatus {
  PENDING = 'pending', // Chờ xác nhận
  CONFIRMED = 'confirmed', // Đã xác nhận
  NOT_CONFIRMED = 'not_confirmed', // Không xác nhận
  PREPARING = 'preparing', // Đang chuẩn bị
  PREPARED = 'prepared', // Chuẩn bị xong
  CANCELLED = 'canceled', // Store huỷ đơn
  COMPLETED = 'completed', // Hoàn thành
  REJECTED = 'rejected', // Từ chối
}

export enum ReadableOrderType {
  PX = 'XP', // it's will be changed to PX
  PC = 'CT', // it's will be changed to PC
  PCC = 'PCC',
}

export enum OrderType {
  XP = 'XP',
  CT = 'CT',
}

export enum OrderErrorCode {
  draft = 1000,
  waiting = 100,
  approved = 200,
  processing = 300,
  prepared = 301,
  delivering = 400,
  completed = 500,
  customer_canceled = 701,
  partner_canceled = 702,
  payment_failed = 704,
}

export enum VoucherType {
  all = 'all',
  individual = 'individual',
}

export enum VoucherUnit {
  percent = 'percent',
  currency = 'currency',
}

/**
 * ORDER EVENT
 */
export enum EventType {
  order_created = 'order_created',
  customer_cancel = 'customer_cancel',
  driver_request = 'driver_request',
  driver_cancel = 'driver_cancel',
}

export enum EventStatus {
  created = 'created',
  timeout = 'timeout',
  approved = 'approved',
  rejected = 'rejected',
}

/**
 * DRIVER SHIPPING
 */
export enum DeliveryStatus {
  received = 'received',
  delivering = 'delivering',
  canceled = 'canceled',
  completed = 'completed',
}
