import { OrderStatus, OrderType, PaymentMethod } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';

export type OrderItem = {
  item: {
    id: string;
    name: string;
  };
  quantity: number;
  base_price: number;
  total_price: number;
  notes: string;
};

export class Order {
  id: string;
  // partnerId: string;
  storeId: string;
  userId: string;
  orderType: OrderType;
  orderCode: string;

  // Price-related columns
  totalPrice: number;
  subTotalPrice: number;
  shippingFee: number;
  discountAmount: number;
  discountShippingFee: number;
  // Payment method field
  paymentMethod: PaymentMethod;
  // Order status and related dates
  status: OrderStatus;
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
}
