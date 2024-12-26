import { EntityRelationalHelper } from '@app/common';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'order_id', nullable: true })
  orderId: string;

  //   @ManyToOne(() => Order, order => order.transactions, { nullable: true, onDelete: 'CASCADE' })
  //   @JoinColumn({ name: 'order_id' })
  //   order: Order;

  //   @ManyToOne(() => Partner, partner => partner.transactions, { nullable: true })
  //   @JoinColumn({ name: 'partner_id' })
  //   partner: Partner;

  //   @ManyToOne(() => Customer, customer => customer.transactions, { nullable: true })
  //   @JoinColumn({ name: 'customer_id' })
  //   customer: Customer;

  @Column('numeric', { nullable: true })
  amount: number;

  @Column('text', { nullable: true })
  description: string;

  //   @Column('enum', { enum: PaymentStatus, nullable: true })
  //   status: PaymentStatus;

  //   @Column('enum', { enum: PaymentMethod, nullable: true })
  //   method: PaymentMethod;

  //   @Column('text', { nullable: true })
  //   statusMessage: string;

  //   @ManyToOne(() => Store, store => store.transactions, { nullable: true })
  //   @JoinColumn({ name: 'store_id' })
  //   store: Store;

  @Column('jsonb', { nullable: true })
  metadata: object | null;

  //   @Column('enum', { enum: PayType, nullable: true })
  //   payType: PayType;

  //   @Column('enum', { enum: PaymentGateway, nullable: true })
  //   paymentGateway: PaymentGateway;

  @Column({ type: 'text', name: 'tx_code', nullable: true })
  txCode: string;

  @Column({ type: 'text', name: 'error_code', nullable: true })
  errorCode: string;

  @Column({ type: 'text', name: 'bill_code', nullable: true })
  billCode: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at', nullable: true })
  updatedAt: Date;
}
