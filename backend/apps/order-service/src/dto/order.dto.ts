import { OrderItem, Order as OrderProto } from '@app/common';

export class OrderDto implements OrderProto {
  orderId: string;

  storeId: string;

  storeName: string;

  introduction: string;

  slug: string;

  thumbnail: string;

  avatar: string;

  orderCode: string;

  totalPrice: number;

  note: string;

  receiverName: string;

  status: string;

  errorCode: number;

  paymentMethod: string;

  createdAt: Date;

  deliveryDate: Date;

  orderItems: OrderItem[];

  constructor(partial: Partial<OrderDto>) {
    Object.assign(this, partial);
  }
}
