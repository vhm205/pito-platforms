import { EntityRelationalHelper } from '@app/common';
import { SourceSystemType, StoreOrderStatus } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';
import { OrderStatus } from '@app/common/types/proto/common';
import {
  StoreOrderDeliveryAddress,
  StoreOrderDeliveryContact,
  StoreOrderInvoiceRequest,
  StoreOrderItem,
  StoreOrderLogs,
  StoreOrderMetadata,
  StoreOrderServiceFee,
} from 'apps/order-service/src/domain';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'store_orders' })
export class StoreOrderEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'store_id', type: 'uuid', nullable: false })
  storeId: string;

  @Column({ name: 'order_code', type: 'text', nullable: false })
  orderCode: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: NullableType<Date>;

  @Column({
    name: 'status',
    type: 'enum',
    enum: StoreOrderStatus, // Giá trị enum
    default: 'pending',
  })
  status: StoreOrderStatus | string;

  @Column({
    name: 'status_code',
    type: 'int4',
    default: OrderStatus.WAITING_FOR_CONFIRMATION,
  })
  statusCode: number;

  @Column({ name: 'delivery_time', type: 'timestamp', nullable: false })
  deliveryDate: Date;

  @Column({ name: 'delivery_contact', type: 'jsonb', nullable: false })
  deliveryContact: StoreOrderDeliveryContact;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: NullableType<string>;

  @Column({ name: 'shipping_fee', type: 'numeric', nullable: false, default: 0 })
  shippingFee: number;

  @Column({ name: 'subtotal_price', type: 'numeric', nullable: false, default: 0 })
  subtotalPrice: number;

  @Column({ name: 'total_price', type: 'numeric', nullable: false, default: 0 })
  totalPrice: number;

  @Column({ name: 'order_items', type: 'jsonb', nullable: true })
  orderItems: Array<StoreOrderItem>;

  @Column({ name: 'service_fee', type: 'jsonb', nullable: true })
  serviceFee: StoreOrderServiceFee;

  @Column({ name: 'delivery_address', type: 'jsonb', nullable: false })
  deliveryAddress: StoreOrderDeliveryAddress;

  @Column({ name: 'invoice_request', type: 'jsonb', nullable: true })
  invoiceRequest: NullableType<StoreOrderInvoiceRequest>;

  @Column({ name: 'order_id', type: 'uuid', nullable: false })
  orderId: string;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: StoreOrderMetadata;

  @Column({ name: 'order_type', type: 'text', nullable: true })
  orderType: SourceSystemType;

  @Column({ name: 'order_logs', type: 'jsonb', nullable: true })
  orderLogs: StoreOrderLogs;

  @Column({ name: 'estimation_time', type: 'int', nullable: true })
  estimationTime: number;

  @Column({ name: 'invoice_status', type: 'int2', nullable: false })
  invoiceStatus: number;

  @Column({ name: 'payment_status', type: 'int2', nullable: false })
  paymentStatus: number;
}
