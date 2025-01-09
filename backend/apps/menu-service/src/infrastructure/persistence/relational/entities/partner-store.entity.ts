import { StoreStatus } from '@app/common/enums';
import { NullableType, ObjectType } from '@app/common/types/common';
import { StoreEngagementLevel, StorePerformanceLevel } from '@app/common/types/proto/common';
import {
  StoreBankAccount,
  StoreContactInfo,
  StoreImage,
  StoreLocation,
} from 'apps/menu-service/src/domain/partner-store.domain';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { StoreServiceEntity } from './store-service.entity';

@Entity('stores')
export class PartnerStoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'partner_id', type: 'uuid' })
  partnerId: string;

  @Column({ type: 'text', name: 'store_name', nullable: false })
  storeName: string;

  @Column({ name: 'store_code', type: 'text', unique: true })
  storeCode: string;

  @Column({ name: 'images', type: 'jsonb', nullable: true })
  images: NullableType<StoreImage>;

  @Column({
    type: 'enum',
    enum: StoreStatus,
  })
  status: StoreStatus;

  @Column({ type: 'boolean', name: 'is_vat', default: false })
  isVat: boolean;

  @Column({ type: 'text', nullable: false })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: NullableType<string>;

  @Column({ type: 'int8', name: 'cuisine_types', array: true, nullable: true })
  cuisineTypes: NullableType<number[]>;

  @Column({ type: 'jsonb', name: 'contacts_info', nullable: true })
  contacts: NullableType<StoreContactInfo[]>;

  @Column({ type: 'jsonb', nullable: true })
  location: NullableType<StoreLocation>;

  @Column({ type: 'jsonb', name: 'bank_account', nullable: true })
  bankAccount: NullableType<StoreBankAccount>;

  @Column({ name: 'prep_times', type: 'jsonb', nullable: true })
  prepTimes: NullableType<ObjectType>;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: NullableType<ObjectType>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;

  @Column({ type: 'int2', name: 'engagement_level', nullable: false })
  engagementLevel: StoreEngagementLevel;

  @Column({ type: 'int2', name: 'performance_level', nullable: false })
  performanceLevel: StorePerformanceLevel;

  // join with store_services table
  @OneToMany(() => StoreServiceEntity, service => service.store)
  services: StoreServiceEntity[];
}
