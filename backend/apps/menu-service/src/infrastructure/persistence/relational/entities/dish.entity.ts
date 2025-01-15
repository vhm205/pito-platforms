import { DishQuantityUnit } from '@app/common/enums/dish';
import { NullableType } from '@app/common/types/common';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CateringPackageOptionEntity } from './catering-package-option.entity';
import { PartnerStoreEntity } from './partner-store.entity';
import { PartnerEntity } from './partner.entity';

@Entity({ name: 'dishes' })
export class DishEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'integer', nullable: true })
  quantity: NullableType<number>;

  @Column({
    name: 'quantity_unit',
    type: 'enum',
    enum: DishQuantityUnit,
    nullable: false,
  })
  quantityUnit: DishQuantityUnit;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @Column({ name: 'store_id', type: 'uuid', nullable: false })
  storeId: string;

  @ManyToOne(() => PartnerStoreEntity)
  @JoinColumn({ name: 'store_id' })
  store: PartnerStoreEntity;

  @Column({ name: 'partner_id', type: 'uuid', nullable: false })
  partnerId: string;

  @ManyToOne(() => PartnerEntity)
  @JoinColumn({ name: 'partner_id' })
  partner: PartnerEntity;

  @Column({ name: 'package_option_id', type: 'integer', nullable: true })
  packageOptionId: NullableType<number>;

  @ManyToOne(() => CateringPackageOptionEntity)
  @JoinColumn({ name: 'package_option_id' })
  packageOption: CateringPackageOptionEntity;
}
