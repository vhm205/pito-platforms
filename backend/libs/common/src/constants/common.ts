import { ReadableOrderStatus, ReadableOrderType, ReadablePaymentMethod } from '../enums';
import { OrderStatus, OrderType, PaymentMethod } from '../types/proto/common';

export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_PAGE_NUMBER = 1;

export const CUSTOMER_DB_SOURCE = 'CUSTOMER_DB_SOURCE';
export const PARTNER_DB_SOURCE = 'PARTNER_DB_SOURCE';

// Map OrderStatus to ReadableOrderStatus
export const orderStatusToReadable: { [key in OrderStatus]?: ReadableOrderStatus } = {
  [OrderStatus.DRAFT]: ReadableOrderStatus.DRAFT,
  [OrderStatus.WAITING]: ReadableOrderStatus.WAITING,
  [OrderStatus.RECEIVED]: ReadableOrderStatus.RECEIVED,
  [OrderStatus.PROCESSING]: ReadableOrderStatus.PROCESSING,
  [OrderStatus.DELIVERING]: ReadableOrderStatus.DELIVERING,
  [OrderStatus.REFUNDING]: ReadableOrderStatus.REFUNDING,
  [OrderStatus.REFUNDED]: ReadableOrderStatus.REFUNDED,
  [OrderStatus.CANCELLED]: ReadableOrderStatus.CANCELLED,
  [OrderStatus.COMPLETED]: ReadableOrderStatus.COMPLETED,
  [OrderStatus.DELIVERY_FAILED]: ReadableOrderStatus.DELIVERY_FAILED,
};

// Reverse map ReadableOrderStatus to OrderStatus
export const readableToOrderStatus: { [key in ReadableOrderStatus]: OrderStatus } = {
  [ReadableOrderStatus.DRAFT]: OrderStatus.DRAFT,
  [ReadableOrderStatus.WAITING]: OrderStatus.WAITING,
  [ReadableOrderStatus.RECEIVED]: OrderStatus.RECEIVED,
  [ReadableOrderStatus.PROCESSING]: OrderStatus.PROCESSING,
  [ReadableOrderStatus.DELIVERING]: OrderStatus.DELIVERING,
  [ReadableOrderStatus.REFUNDING]: OrderStatus.REFUNDING,
  [ReadableOrderStatus.REFUNDED]: OrderStatus.REFUNDED,
  [ReadableOrderStatus.CANCELLED]: OrderStatus.CANCELLED,
  [ReadableOrderStatus.COMPLETED]: OrderStatus.COMPLETED,
  [ReadableOrderStatus.DELIVERY_FAILED]: OrderStatus.DELIVERY_FAILED,
};

// Map ReadablePaymentMethod to PaymentMethod
export const readableToPaymentMethod: { [key in ReadablePaymentMethod]: PaymentMethod } = {
  [ReadablePaymentMethod.AMEX]: PaymentMethod.PAYMENT_METHOD_AMEX,
  [ReadablePaymentMethod.ATM]: PaymentMethod.PAYMENT_METHOD_ATM,
  [ReadablePaymentMethod.JCB]: PaymentMethod.PAYMENT_METHOD_JCB,
  [ReadablePaymentMethod.MASTERCARD]: PaymentMethod.PAYMENT_METHOD_MASTERCARD,
  [ReadablePaymentMethod.QR_CODE]: PaymentMethod.PAYMENT_METHOD_QRCODE,
  [ReadablePaymentMethod.UPI]: PaymentMethod.PAYMENT_METHOD_UPI,
  [ReadablePaymentMethod.VISA]: PaymentMethod.PAYMENT_METHOD_VISA,
};

// Reverse map PaymentMethod to ReadablePaymentMethod
export const paymentMethodToReadable: { [key in PaymentMethod]?: ReadablePaymentMethod } = {
  [PaymentMethod.PAYMENT_METHOD_AMEX]: ReadablePaymentMethod.AMEX,
  [PaymentMethod.PAYMENT_METHOD_ATM]: ReadablePaymentMethod.ATM,
  [PaymentMethod.PAYMENT_METHOD_JCB]: ReadablePaymentMethod.JCB,
  [PaymentMethod.PAYMENT_METHOD_MASTERCARD]: ReadablePaymentMethod.MASTERCARD,
  [PaymentMethod.PAYMENT_METHOD_QRCODE]: ReadablePaymentMethod.QR_CODE,
  [PaymentMethod.PAYMENT_METHOD_UPI]: ReadablePaymentMethod.UPI,
  [PaymentMethod.PAYMENT_METHOD_VISA]: ReadablePaymentMethod.VISA,
};

// Map OrderType to ReadableOrderType
export const orderTypeToReadable: { [key in OrderType]?: ReadableOrderType } = {
  [OrderType.PX]: ReadableOrderType.PX,
  [OrderType.PC]: ReadableOrderType.PC,
  [OrderType.PCC]: ReadableOrderType.PCC,
};

// Reverse map ReadableOrderType to OrderType
export const readableToOrderType: { [key in ReadableOrderType]: OrderType } = {
  [ReadableOrderType.PX]: OrderType.PX,
  [ReadableOrderType.PC]: OrderType.PC,
  [ReadableOrderType.PCC]: OrderType.PCC,
};
