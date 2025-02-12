import { EntityRelationalHelper } from '@app/common';
import { StoreType } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PartnerStoreEntity } from './partner-store.entity';

@Entity({ name: 'categories' })
export class PartnerCategoryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'store_id', nullable: true })
  storeId: NullableType<string>;

  @ManyToOne(() => PartnerStoreEntity)
  @JoinColumn({ name: 'store_id' })
  store: NullableType<PartnerStoreEntity>;

  @Column({
    name: 'store_type',
    type: 'enum',
    enum: StoreType,
    nullable: false,
  })
  storeType: StoreType;

  @Column('text', { name: 'name', nullable: false })
  name: string;
}
