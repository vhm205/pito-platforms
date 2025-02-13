import { ReadableOrderStatus, ReadableOrderType, ReadablePaymentMethod } from '../enums';
import { OrderStatus, OrderType, PaymentMethod } from '../types/proto/common';

export const PLATFORM_FEE_RATE = 20;

export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_PAGE_NUMBER = 1;

export const CUSTOMER_DB_SOURCE = 'CUSTOMER_DB_SOURCE';
export const PARTNER_DB_SOURCE = 'PARTNER_DB_SOURCE';

// Map OrderStatus to ReadableOrderStatus
export const orderStatusToReadable: { [key in OrderStatus]?: ReadableOrderStatus } = {
  [OrderStatus.DRAFT]: ReadableOrderStatus.DRAFT,
  [OrderStatus.PAYMENT_FAILED]: ReadableOrderStatus.PAYMENT_FAILED,
  [OrderStatus.WAITING_FOR_CONFIRMATION]: ReadableOrderStatus.WAITING_FOR_CONFIRMATION,
  [OrderStatus.CANCELED]: ReadableOrderStatus.CANCELED,
  [OrderStatus.REJECTED]: ReadableOrderStatus.REJECTED,
  [OrderStatus.UNCONFIRMED]: ReadableOrderStatus.UNCONFIRMED,
  [OrderStatus.CONFIRMED]: ReadableOrderStatus.CONFIRMED,
  [OrderStatus.PREPARING]: ReadableOrderStatus.PREPARING,
  [OrderStatus.DELIVERING]: ReadableOrderStatus.DELIVERING,
  [OrderStatus.DELIVERY_FAILED]: ReadableOrderStatus.DELIVERY_FAILED,
  [OrderStatus.COMPLETED]: ReadableOrderStatus.COMPLETED,
};

// Reverse map ReadableOrderStatus to OrderStatus
export const readableToOrderStatus: { [key in ReadableOrderStatus]: OrderStatus } = {
  [ReadableOrderStatus.DRAFT]: OrderStatus.DRAFT,
  [ReadableOrderStatus.PAYMENT_FAILED]: OrderStatus.PAYMENT_FAILED,
  [ReadableOrderStatus.WAITING_FOR_CONFIRMATION]: OrderStatus.WAITING_FOR_CONFIRMATION,
  [ReadableOrderStatus.CANCELED]: OrderStatus.CANCELED,
  [ReadableOrderStatus.REJECTED]: OrderStatus.REJECTED,
  [ReadableOrderStatus.UNCONFIRMED]: OrderStatus.UNCONFIRMED,
  [ReadableOrderStatus.CONFIRMED]: OrderStatus.CONFIRMED,
  [ReadableOrderStatus.PREPARING]: OrderStatus.PREPARING,
  [ReadableOrderStatus.DELIVERING]: OrderStatus.DELIVERING,
  [ReadableOrderStatus.DELIVERY_FAILED]: OrderStatus.DELIVERY_FAILED,
  [ReadableOrderStatus.COMPLETED]: OrderStatus.COMPLETED,
  [ReadableOrderStatus.WAITING_FOR_DEPOSIT]: OrderStatus.WAITING_FOR_DEPOSIT,
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
  [ReadablePaymentMethod.PAY_LATER]: PaymentMethod.UNRECOGNIZED,
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
