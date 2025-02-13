import {
  OrderItem,
  Order as OrderMessage,
  readableToOrderType,
  readableToPaymentMethod,
} from '@app/common';
import { ReadableOrderStatus, ReadableOrderType, ReadablePaymentMethod } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';

// export type OrderItem = {
//   item: {
//     id: string;
//     name: string;
//     slug: string;
//     images: string[];
//     basePrice: number;
//   };
//   quantity: number;
//   totalPrice: number;
//   notes: string;
// };

export interface VatInfo {
  name: string;
  taxCode: string;
  email: string;
  address: string;
  isDefault: boolean;
}

export class Order {
  id: string;
  partnerId: string;
  storeId: string;
  userId: string;
  orderType: ReadableOrderType;
  orderCode: string;

  // Price-related columns
  totalPrice: number;
  subTotalPrice: number;
  shippingFee: number;
  discountAmount: number;
  discountShippingFee: number;
  // Payment method field
  paymentMethod: ReadablePaymentMethod;
  // Order status and related dates
  status: ReadableOrderStatus;
  statusCode: number;
  operatorStatusCode: number;
  deliveryAt: NullableType<Date>;
  deliveryFailedAt: NullableType<Date>;
  completedAt: NullableType<Date>;
  cancelledAt: NullableType<Date>;
  preparedAt: NullableType<Date>;
  confirmedAt: NullableType<Date>;
  // Delivery-related information
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  deliveryTime: NullableType<string>;
  deliveryEta: NullableType<number>;
  trackingUrl: NullableType<string>;
  deliveryDate: Date | undefined;

  // Cancellation and additional details
  cancelReason: NullableType<string>;
  deliveryLater: NullableType<boolean>;
  note: NullableType<string>;
  orderItems: Array<OrderItem>;
  vatInfo: NullableType<VatInfo>;
  orderCount: NullableType<string>;
  errorCode: NullableType<number>;
  metadata: NullableType<Record<string, any>>;
  receiverEmail: NullableType<string>;

  // Timestamps
  createdAt: Date | undefined;
  updatedAt: NullableType<Date>;
  preparingAt: NullableType<Date>;
  canceledByUser: boolean;

  refundStatus: NullableType<number>;
  refundedAt: NullableType<Date>;

  toMessage(): OrderMessage {
    return {
      id: this.id,
      storeId: this.storeId,
      userId: this.userId,
      orderType: readableToOrderType[this.orderType],
      orderCode: this.orderCode,
      totalPrice: this.totalPrice,
      subTotalPrice: this.subTotalPrice,
      shippingFee: this.shippingFee,
      discountAmount: this.discountAmount,
      discountShippingFee: this.discountShippingFee,
      paymentMethod: readableToPaymentMethod[this.paymentMethod],
      statusCode: this.statusCode,
      operatorStatusCode: this.operatorStatusCode,
      deliveryAt: this.deliveryAt ?? undefined,
      deliveryFailedAt: this.deliveryFailedAt ?? undefined,
      completedAt: this.completedAt ?? undefined,
      cancelledAt: this.cancelledAt ?? undefined,
      preparedAt: this.preparedAt ?? undefined,
      confirmedAt: this.confirmedAt ?? undefined,
      receiverName: this.receiverName,
      receiverPhone: this.receiverPhone,
      deliveryAddress: this.deliveryAddress,
      // deliveryTime: 'this.deliveryTime',
      deliveryEta: this.deliveryEta ?? 0,
      trackingUrl: this.trackingUrl ?? undefined,
      deliveryDate: this.deliveryDate ?? undefined,
      cancelReason: this.cancelReason ?? undefined,
      deliveryLater: Boolean(this.deliveryLater),
      note: this.note ?? undefined,
      orderItems: this.orderItems as any,
      vatInfo: this.vatInfo as VatInfo,
      errorCode: 0, //  this.errorCode
      metadata: this.metadata as Record<string, unknown>,
      receiverEmail: this.receiverEmail!,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt ?? undefined,
      preparingAt: this.preparingAt ?? undefined,
      canceledByUser: this.canceledByUser,
      refundStatus: this.refundStatus ?? 0,
      refundedAt: this.refundedAt ?? undefined,
    };
  }
}
