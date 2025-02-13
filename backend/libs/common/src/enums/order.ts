export enum ReadableOrderStatus {
  DRAFT = 'draft',
  WAITING_FOR_DEPOSIT = 'wait_for_deposit',
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

// export enum OrderStatusCode {
//   DRAFT = 1000,
//   WAITING = 100,
//   APPROVED = 200,
//   PROCESSING = 300,
//   PREPARED = 301,
//   DELIVERING = 400,
//   COMPLETED = 500,
//   CUSTOMER_CANCELED = 701,
//   PARTNER_CANCELED = 702,
//   PAYMENT_FAILED = 704,
// }

export enum OrderStatusCode {
  DRAFT = 0,
  WAITING_FOR_DEPOSIT = 1,
  PAYMENT_FAILED = 10,
  WAITING_FOR_CONFIRMATION = 20,
  CANCELED = 30,
  REJECTED = 31,
  CONFIRMED = 40,
  UNCONFIRMED = 41,
  PREPARING = 50,
  PREPARED = 51,
  DELIVERING = 60,
  DELIVERY_FAILED = 61,
  COMPLETED = 100,
  UNRECOGNIZED = -1,
}

// TODO: remove after
export enum OrderErrorCode {
  DRAFT = 1000,
  WAITING_FOR_DEPOSIT = 1001,
  WAITING = 100,
  APPROVED = 200,
  PROCESSING = 300,
  PREPARED = 301,
  DELIVERING = 400,
  COMPLETED = 500,
  CUSTOMER_CANCELED = 701,
  PARTNER_CANCELED = 702,
  PAYMENT_FAILED = 704,
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

/**
 * Voucher
 */
export enum VoucherType {
  ALL = 'all',
  INDIVIDUAL = 'individual',
}

export enum VoucherUnit {
  PERCENT = 'percent',
  CURRENCY = 'currency',
}

/**
 * ORDER EVENT
 */
export enum OrderPatternEvent {
  PAYMENT_SUCCESS = 'order.payment.success',
  PAYMENT_FAILED = 'order.payment.failed',
  PAYMENT_TIMEOUT = 'order.payment.timeout',
}
