import { EntityRelationalHelper } from '@app/common';
import { MaybeType } from '@app/common/types/common';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'fees' })
export class SettingFeeEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ enum: ['percentage', 'fixed'] })
  type: string;

  @Column({ type: 'numeric', name: 'value' })
  value: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'int2', array: true, name: 'service_type' })
  serviceType: number[];

  @Column({ type: 'text' })
  key: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true })
  updatedAt: MaybeType<Date>;
}
