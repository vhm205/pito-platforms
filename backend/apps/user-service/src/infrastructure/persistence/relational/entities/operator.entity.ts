import { NullableType, ObjectType } from '@app/common/types/common';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('operator_accounts')
export class OperatorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: true })
  phone: NullableType<string>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: NullableType<ObjectType>;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: NullableType<string>;

  @Column({ name: 'first_name', type: 'text', nullable: true })
  firstName: NullableType<string>;

  @Column({ name: 'last_name', type: 'text', nullable: true })
  lastName: NullableType<string>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: NullableType<Date>;
}
