import { EntityRelationalHelper } from '@app/common';
import { MenuType } from '@app/common/enums/menu';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'menu_categories' })
export class PartnerMenuCategoriesEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'menu_id' })
  menuId: string;

  @Column('text', { name: 'notes', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('smallint', { name: 'index', default: 0 })
  index: number;

  @Column('boolean', { name: 'is_active', default: false })
  isActive: boolean;

  @Column('bigint', { name: 'package_id', nullable: true })
  packageId: number | null;

  @Column('uuid', { name: 'category_id', nullable: true })
  categoryId: string | null;

  @Column({
    name: 'type',
    type: 'enum',
    enum: MenuType,
    nullable: false,
  })
  type: MenuType;
}
