/**
 * ORDER
 */
export enum OrderStatus {
  draft = 'draft',
  waiting = 'waiting',
  received = 'received',
  processing = 'processing',
  delivering = 'delivering',
  refunding = 'refunding',
  refunded = 'refunded',
  canceled = 'canceled',
  completed = 'completed',
}

export enum PartnerOrderStatus {
  created = 'created',
  processing = 'processing',
  canceled = 'canceled',
  rejected = 'rejected',
  missed = 'missed',
  prepared = 'prepared',
  completed = 'completed',
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
