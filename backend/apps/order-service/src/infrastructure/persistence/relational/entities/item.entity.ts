import { EntityRelationalHelper } from '@app/common';
import { UnitType, PackagingType, EatingUtensil } from '@app/common/enums/item';
import { NullableType } from '@app/common/types/common';
import { RawItemOptionAndChoice } from '@app/common/types/item';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('items')
export class ItemEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', { name: 'base_price', nullable: true })
  basePrice: NullableType<string>;

  @Column('text', { name: 'name', nullable: true })
  name: NullableType<string>;

  @Column('text', { name: 'description', nullable: true })
  description: NullableType<string>;

  @Column('text', { name: 'extra_description', nullable: true })
  extraDescription: NullableType<string>;

  @Column('json', { name: 'images', nullable: true })
  images: any;

  @Column('smallint', { name: 'unit_quantity', nullable: true })
  unitQuantity: NullableType<number>;

  @Column('integer', { name: 'preparation_time', nullable: true })
  preparationTime: NullableType<number>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: NullableType<Date>;

  @Column('bigint', { name: 'cuisine_types', array: true })
  cuisineTypes: number[];

  @Column('bigint', { name: 'special_dietaries', array: true })
  specialDietaries: number[];

  @Column('uuid', { name: 'menu_category_id', nullable: true })
  menuCategoryId: NullableType<string>;

  @Column({
    name: 'unit_type',
    type: 'enum',
    enum: UnitType,
    default: UnitType.PERSON,
  })
  unitType: UnitType;

  @Column('smallint', { name: 'min_quantity', nullable: true })
  minQuantity: NullableType<number>;

  @Column('smallint', { name: 'max_quantity', nullable: true })
  maxQuantity: NullableType<number>;

  @Column({
    name: 'packaging_type',
    type: 'enum',
    enum: PackagingType,
    nullable: true,
  })
  packagingType: NullableType<PackagingType>;

  @Column({
    name: 'eating_utensil',
    type: 'enum',
    enum: EatingUtensil,
    nullable: true,
  })
  eatingUtensil: NullableType<EatingUtensil>;

  @Column('text', { name: 'special_note', nullable: true })
  specialNote: NullableType<string>;

  @Column('boolean', { name: 'server_available', default: true })
  serverAvailable: NullableType<boolean>;

  @Column('boolean', { name: 'add_more_food', default: false })
  addMoreFood: boolean;

  @Column('boolean', { name: 'setup_party', default: false })
  setupParty: boolean;

  @Column('bigint', { name: 'occasion_events', array: true })
  occasionEvents: number[];

  @Column('tsvector', { name: 'fts_vector', nullable: true })
  ftsVector: NullableType<string>;

  @Column('bigint', { name: 'service_types', array: true })
  serviceTypes: number[];

  @Column('uuid', { name: 'store_id' })
  storeId: string;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('jsonb', { name: 'options_and_choices', nullable: true })
  optionsAndChoices: NullableType<RawItemOptionAndChoice[]>;

  @Column('bigint', { name: 'index' })
  index: number;

  @Column('text', { name: 'slug' })
  slug: string;
}
