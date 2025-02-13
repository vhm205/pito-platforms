import { EntityRelationalHelper } from '@app/common';
import {
  PaymentGateway,
  PaymentStatus,
  PaymentType,
  ReadablePaymentMethod,
  TxErrorCode,
} from '@app/common/enums';
import { NullableType } from '@app/common/types/common';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'order_id' })
  orderId: string;

  @Column({ type: 'uuid', name: 'customer_id' })
  customerId: string;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: ReadablePaymentMethod,
    default: ReadablePaymentMethod.ATM,
  })
  method: ReadablePaymentMethod;

  @Column({ type: 'text', name: 'status_message', nullable: true })
  statusMessage: NullableType<string>;

  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: NullableType<Record<string, any>>;

  @Column({
    type: 'enum',
    name: 'pay_type',
    enum: PaymentType,
    default: PaymentType.DP,
  })
  payType: PaymentType;

  @Column({
    type: 'enum',
    name: 'payment_gateway',
    enum: PaymentGateway,
    default: PaymentGateway.VNPAY,
  })
  paymentGateway: PaymentGateway;

  @Column({ type: 'text', name: 'tx_code' })
  txCode: string;

  @Column({ type: 'enum', enum: TxErrorCode, name: 'error_code' })
  errorCode: TxErrorCode;

  @Column({ type: 'text', name: 'bill_code', nullable: true })
  billCode: NullableType<string>;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date | string;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;
}
