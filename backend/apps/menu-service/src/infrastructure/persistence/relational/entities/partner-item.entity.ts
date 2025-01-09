import { EntityRelationalHelper } from '@app/common';
import { SourceSystemType } from '@app/common/enums';
import { PackagingType, ItemStatus, UnitType, ItemServiceType } from '@app/common/enums/item';
import { NullableType } from '@app/common/types/common';
import {
  RawItemServiceSettings,
  RawPartnerItemMetadata,
  RawPartnerItemOptionAndChoice,
} from '@app/common/types/item';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PartnerMenuCategoriesEntity } from './partner-menu-category.entity';
import { PartnerStoreEntity } from './partner-store.entity';

@Entity({ name: 'items' })
export class PartnerItemEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'menu_category', nullable: false })
  @OneToOne(() => PartnerMenuCategoriesEntity)
  @JoinColumn({ name: 'menu_category' })
  menuCategory: string;

  @Column('uuid', { name: 'store_id', nullable: false })
  storeId: string;

  @ManyToOne(() => PartnerStoreEntity)
  @JoinColumn({ name: 'store_id' })
  store: PartnerStoreEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;

  @Column({ type: 'timestamp', name: 'order_deadline_at', nullable: true })
  orderDeadlineAt: NullableType<Date>;

  @Column('bigint', { name: 'cuisine_types', array: true, nullable: true })
  cuisineTypes: number[];

  @Column('bigint', { name: 'special_dietaries', array: true })
  specialDietaries: number[];

  @Column('numeric', { name: 'base_price', nullable: false })
  basePrice: number;

  @Column('text', { name: 'name', nullable: false })
  name: string;

  @Column('text', { name: 'description', nullable: true })
  description: NullableType<string>;

  @Column('uuid', { name: 'menu_id', nullable: false })
  menuId: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.DRAFT,
    nullable: false,
  })
  status: ItemStatus;

  @Column('numeric', { name: 'min_quantity', default: 1, nullable: false })
  minQuantity: number;

  @Column('numeric', { name: 'preparation_time', default: 0, nullable: false })
  preparationTime: number;

  @Column('jsonb', { name: 'options_choices', nullable: true, default: '[]' })
  optionsChoices: NullableType<RawPartnerItemOptionAndChoice[]>;

  @Column('jsonb', { name: 'metadata', nullable: true })
  metadata: NullableType<RawPartnerItemMetadata>;

  @Column({
    name: 'packaging_type',
    type: 'enum',
    enum: PackagingType,
    default: PackagingType.PAPER,
    nullable: false,
  })
  packagingType: PackagingType;

  @Column('text', { name: 'images', array: true, default: '{}', nullable: false })
  images: string[];

  @Column('smallint', { name: 'index', default: 0, nullable: false })
  index: number;

  @Column({
    name: 'packaging_unit',
    type: 'enum',
    enum: UnitType,
    nullable: true,
  })
  packagingUnit: UnitType;

  @Column('smallint', { name: 'participant', default: 1, nullable: false })
  participant: number;

  @Column('text', { name: 'slug', nullable: false })
  slug: string;

  @Column('bigint', { name: 'occasion_events', array: true, default: '{}', nullable: true })
  occasionEvents: number[];

  @Column('bigint', { name: 'catering_packages', array: true, default: '{}', nullable: false })
  cateringPackages: number[];

  @Column({
    type: 'int4',
    name: 'service_type',
    default: ItemServiceType.SELF_SERVICE,
    nullable: false,
  })
  serviceType: number;

  @Column({
    type: 'jsonb',
    name: 'service_settings',
    default: '{"setup_time": 0, "service_person": 0, "service_time": 0}',
    nullable: false,
  })
  serviceSettings: RawItemServiceSettings;

  @Column({ name: 'service_category', type: 'enum', enum: SourceSystemType, nullable: true })
  serviceCategory: SourceSystemType;
}
