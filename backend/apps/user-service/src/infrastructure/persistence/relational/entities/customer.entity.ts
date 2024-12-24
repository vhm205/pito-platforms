import { CustomerGender } from '@app/common/enums/customer';
import { NullableType } from '@app/common/types/common';
import { DeliveryAddress } from 'apps/user-service/src/domain/customer.domain';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customer_accounts')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  name: NullableType<string>;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  phone: NullableType<string>;

  @Column({ type: 'enum', enum: CustomerGender, name: 'gender', nullable: true })
  gender: NullableType<CustomerGender>;

  @Column({ type: 'text', nullable: true })
  avatar: NullableType<string>;

  @Column({ type: 'text', nullable: true })
  thumbnail: NullableType<string>;

  @Column({ name: 'contact_address', type: 'jsonb', nullable: true })
  contactAddress: NullableType<Record<string, any>>;

  @Column({ name: 'delivery_addresses', type: 'jsonb', nullable: true })
  deliveryAddresses: NullableType<DeliveryAddress[]>;

  @Column({ name: 'first_name', type: 'text', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'text', nullable: false })
  lastName: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: NullableType<Date>;
}
