import { EntityRelationalHelper } from '@app/common';
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

import { MenuEntity } from './menu.entity';

@Entity({ name: 'menu_categories' })
export class PartnerMenuCategoriesEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'menu_id', nullable: false })
  menuId: string;

  @ManyToOne(() => MenuEntity)
  @JoinColumn({ name: 'menu_id' })
  menu: MenuEntity;

  @Column('text', { name: 'notes', nullable: true })
  notes: NullableType<string>;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;

  @Column('smallint', { name: 'index', nullable: false })
  index: number;

  @Column('boolean', { name: 'is_active', nullable: false, default: true })
  isActive: boolean;

  @Column('bigint', { name: 'package_id', nullable: true })
  packageId: NullableType<number>;

  @Column('uuid', { name: 'category_id', nullable: true })
  categoryId: NullableType<string>;

  @Column({
    name: 'type',
    type: 'enum',
    enum: MenuType,
    nullable: false,
  })
  type: MenuType;
}
