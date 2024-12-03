import {
  Order as OrderMessage,
  readableToOrderStatus,
  readableToOrderType,
  readableToPaymentMethod,
} from '@app/common';
import { ReadableOrderStatus, ReadableOrderType, ReadablePaymentMethod } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';

export type OrderItem = {
  item: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    basePrice: number;
  };
  quantity: number;
  totalPrice: number;
  notes: string;
};

export class Order {
  id: string;
  // partnerId: string;
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
  // deliveryTime: NullableType<string>;
  deliveryEta: NullableType<number>;
  trackingUrl: NullableType<string>;
  deliveryDate: NullableType<Date>;

  // Cancellation and additional details
  cancelReason: NullableType<string>;
  deliveryLater: NullableType<boolean>;
  note: NullableType<string>;
  orderItems: Array<OrderItem>;
  vatInfo: NullableType<object>;
  orderCount: NullableType<string>;
  errorCode: NullableType<number>;
  metadata: NullableType<object>;
  receiverEmail: NullableType<string>;

  // Timestamps
  createdAt: Date;
  updatedAt: NullableType<Date>;

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
      status: readableToOrderStatus[this.status],
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
      orderItems: this.orderItems,
      vatInfo: this.vatInfo as Record<string, unknown>,
      orderCount: this.orderCount!,
      errorCode: 0, //  this.errorCode
      metadata: this.metadata as Record<string, unknown>,
      receiverEmail: this.receiverEmail!,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt ?? undefined,
    };
  }
}
