import { EntityRelationalHelper } from '@app/common';
import { ReadableOrderStatus, ReadableOrderType, ReadablePaymentMethod } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Business-related information
  @Column({ type: 'uuid', name: 'partner_id', nullable: true })
  partnerId: NullableType<string>;

  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

  @Column({ type: 'uuid', name: 'customer_id' })
  customerId: string;

  @Column({
    type: 'enum',
    enum: ReadableOrderType,
    name: 'order_type',
    default: ReadableOrderType.PX,
  })
  orderType: ReadableOrderType;

  @Column({ type: 'text', name: 'order_code' })
  orderCode: string;

  // Price-related columns
  @Column({ type: 'numeric', name: 'total_price', default: 0 })
  totalPrice: number;

  @Column({ type: 'numeric', name: 'sub_total_price', default: 0 })
  subTotalPrice: number;

  @Column({ type: 'numeric', name: 'shipping_fee', default: 0 })
  shippingFee: number;

  @Column({ type: 'numeric', name: 'discount_amount', default: 0 })
  discountAmount: number;

  @Column({ type: 'numeric', name: 'discount_shipping_fee', default: 0 })
  discountShippingFee: number;

  // Payment method field
  @Column({ type: 'enum', enum: ReadablePaymentMethod, name: 'payment_method' })
  paymentMethod: ReadablePaymentMethod;

  // Order status and related dates
  @Column({ type: 'enum', enum: ReadableOrderStatus, default: ReadableOrderStatus.DRAFT })
  status: ReadableOrderStatus;

  @Column({ type: 'int4', name: 'status_code' })
  statusCode: number;

  @Column({ type: 'int4', name: 'operator_status_code' })
  operatorStatusCode: number;

  @Column({ type: 'timestamp', name: 'delivery_at', nullable: true })
  deliveryAt: NullableType<Date>;

  @Column({ type: 'timestamp', name: 'completed_at', nullable: true })
  completedAt: NullableType<Date>;

  @Column({ type: 'timestamp', name: 'cancelled_at', nullable: true })
  cancelledAt: NullableType<Date>;

  @Column({ type: 'timestamp', name: 'prepared_at', nullable: true })
  preparedAt: NullableType<Date>;

  @Column({ type: 'timestamp', name: 'preparing_at', nullable: true })
  preparingAt: NullableType<Date>;

  @Column({ type: 'timestamp', name: 'confirmed_at', nullable: true })
  confirmedAt: NullableType<Date>;

  // Delivery-related information
  @Column({ type: 'text', name: 'receiver_name' })
  receiverName: string;

  @Column({ type: 'text', name: 'receiver_phone' })
  receiverPhone: string;

  @Column({ type: 'text', name: 'delivery_address' })
  deliveryAddress: string;

  // @Column({ type: 'time', name: 'delivery_time', nullable: true })
  // deliveryTime: NullableType<string>;

  @Column({ type: 'numeric', name: 'delivery_eta', nullable: true })
  deliveryEta: NullableType<number>;

  @Column({ type: 'text', name: 'tracking_url', nullable: true })
  trackingUrl: NullableType<string>;

  @Column({ type: 'timestamp', name: 'delivery_date', nullable: true })
  deliveryDate: NullableType<Date>;

  @Column({ type: 'timestamp', name: 'delivery_failed_at', nullable: true })
  deliveryFailedAt: NullableType<Date>;

  // Cancellation and additional details
  @Column({ type: 'text', name: 'cancel_reason', nullable: true })
  cancelReason: NullableType<string>;

  @Column({ type: 'boolean', name: 'cancelled_by_user', default: null, nullable: true })
  canceledByUser: boolean;

  @Column({ type: 'boolean', name: 'delivery_later', nullable: true })
  deliveryLater: NullableType<boolean>;

  @Column({ type: 'text', name: 'note', nullable: true })
  note: NullableType<string>;

  @Column({ type: 'jsonb', name: 'order_items', nullable: true })
  orderItems: Array<any>; // we will need to create a new entity for this

  @Column({ type: 'jsonb', name: 'vat_info', nullable: true })
  vatInfo: NullableType<object>;

  @Column({ type: 'text', name: 'order_count', nullable: true })
  orderCount: NullableType<string>;

  @Column({ type: 'int', name: 'error_code', nullable: true })
  errorCode: NullableType<number>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: NullableType<object>;

  @Column({ type: 'text', name: 'receiver_email', nullable: true })
  receiverEmail: NullableType<string>;

  // Timestamps
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true, default: null })
  updatedAt: NullableType<Date>;
}
