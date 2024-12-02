import { EntityRelationalHelper } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'occasion_events' })
export class OccasionEventEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ type: 'text', nullable: true, name: 'description' })
  description: NullableType<string>;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'text', nullable: true, name: 'image' })
  image: NullableType<string>;

  @Column({ type: 'smallint', name: 'index' })
  index: number;
}
