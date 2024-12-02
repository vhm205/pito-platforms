import { EntityRelationalHelper } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ type: 'text', nullable: true, name: 'description' })
  description: NullableType<string>;

  @Column({ type: 'varchar', name: 'type' })
  type: string;

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'smallint', name: 'index' })
  index: number;

  @Column({ type: 'text', nullable: true, name: 'link_id' })
  linkId: NullableType<string>;
}
