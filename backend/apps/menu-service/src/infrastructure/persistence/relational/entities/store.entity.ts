import { EntityRelationalHelper } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Coordinates, OpeningHours, ShippingFeeSetting } from '@app/common/types/store';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MenuStatus {
  NOT_AVAILABLE = 'not_available',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
}

@Entity('stores')
export class StoreEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'partner_id', type: 'uuid' })
  partnerId: string;

  @Column({ name: 'store_name', type: 'text' })
  storeName: string;

  @Column({ name: 'introduction', type: 'text', nullable: true })
  introduction: NullableType<string>;

  @Column({ name: 'avatar', type: 'text', nullable: true })
  avatar: NullableType<string>;

  @Column({ name: 'thumbnail', type: 'text', nullable: true })
  thumbnail: NullableType<string>;

  @Column({ name: 'email', type: 'text', nullable: true })
  email: NullableType<string>;

  @Column({ name: 'phone', type: 'text', nullable: true })
  phone: NullableType<string>;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_vat', type: 'boolean', default: false })
  isVat: boolean;

  @Column({ name: 'star_rating', type: 'smallint', default: 0 })
  starRating: number;

  @Column({ name: 'timeliness_rate', type: 'real', default: 0 })
  timelinessRate: number;

  @Column({ name: 'cover', type: 'text', nullable: true })
  cover: NullableType<string>;

  @Column({ name: 'coordinates', type: 'jsonb', nullable: true })
  coordinates: NullableType<Coordinates>;

  @Column({ name: 'opening_hours', type: 'jsonb', nullable: true })
  openingHours: NullableType<Record<string, OpeningHours>>;

  @Column({
    name: 'menu_status',
    type: 'enum',
    enum: MenuStatus,
    default: MenuStatus.NOT_AVAILABLE,
  })
  menuStatus: MenuStatus;

  @Column({ name: 'cuisine_types', type: 'bigint', array: true })
  cuisineTypes: number[];

  @Column({ name: 'special_dietaries', type: 'bigint', array: true })
  specialDietaries: number[];

  @Column({ name: 'occasion_events', type: 'bigint', array: true })
  occasionEvents: number[];

  @Column({ name: 'service_types', type: 'bigint', array: true })
  serviceTypes: number[];

  @Column({ name: 'min_participants', type: 'smallint', nullable: true })
  minParticipants: NullableType<number>;

  @Column({ name: 'min_preparation_time', type: 'int', nullable: true })
  minPreparationTime: NullableType<number>;

  @Column({ name: 'store_name_vector', type: 'tsvector', nullable: true })
  storeNameVector: NullableType<string>;

  @Column({ name: 'min_order_value', type: 'numeric', precision: 10, scale: 2, nullable: true })
  minOrderValue: NullableType<number>;

  @Column({ name: 'location', type: 'jsonb', nullable: true })
  location: NullableType<Location>;

  @Column({ name: 'services_available', type: 'bigint', array: true, nullable: true })
  servicesAvailable: NullableType<number[]>;

  @Column({ name: 'store_code', type: 'text' })
  storeCode: string;

  @Column({ name: 'shipping_fee_settings', type: 'jsonb', nullable: true })
  shippingFeeSettings: NullableType<ShippingFeeSetting>;

  @Column({ name: 'slug', type: 'text' })
  slug: string;

  @Column({ name: 'bank_name', type: 'text', nullable: true })
  bankName: NullableType<string>;

  @Column({ name: 'bank_account', type: 'text', nullable: true })
  bankAccount: NullableType<string>;

  @Column({ name: 'status', type: 'text', nullable: true })
  status: NullableType<string>;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: NullableType<Date>;
}
