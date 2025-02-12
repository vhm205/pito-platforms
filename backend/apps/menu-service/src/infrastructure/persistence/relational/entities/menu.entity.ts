import { EntityRelationalHelper } from '@app/common';
import { SourceSystemType } from '@app/common/enums';
import { MenuType } from '@app/common/enums/menu';
import { NullableType } from '@app/common/types/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PartnerStoreEntity } from './partner-store.entity';

@Entity({ name: 'menus' })
export class MenuEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'store_id', nullable: false })
  storeId: string;

  @ManyToOne(() => PartnerStoreEntity)
  @JoinColumn({ name: 'store_id' })
  store: PartnerStoreEntity;

  @Column('text', { name: 'notes', nullable: true })
  notes: NullableType<string>;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: NullableType<Date>;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;

  @Column('boolean', { name: 'is_active', nullable: false, default: true })
  isActive: boolean;

  @Column({
    name: 'type',
    type: 'enum',
    enum: SourceSystemType,
    nullable: false,
  })
  type: SourceSystemType;

  @Column({
    name: 'menu_type',
    type: 'enum',
    enum: MenuType,
    nullable: true,
  })
  menuType: NullableType<MenuType>;

  @Column('text', { name: 'name', nullable: true })
  name: NullableType<string>;
}
