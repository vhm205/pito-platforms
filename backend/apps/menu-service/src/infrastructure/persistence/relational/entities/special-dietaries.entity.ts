import { EntityRelationalHelper } from '@app/common';
import { NullableType } from '@app/common/types/common';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'special_dietaries' })
export class SpecialDietaryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ type: 'text', nullable: true, name: 'description' })
  description: NullableType<string>;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'text', nullable: true, name: 'image' })
  image: NullableType<string>;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'smallint', name: 'index' })
  index: number;
}
