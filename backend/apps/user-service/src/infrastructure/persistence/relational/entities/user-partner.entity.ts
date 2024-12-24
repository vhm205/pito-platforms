import { NullableType } from '@app/common/types/common';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users', schema: 'public' })
export class UserPartnerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // References the internal Supabase Auth user.

  @Column({ name: 'full_name', type: 'text', nullable: true })
  fullName: NullableType<string>;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: true })
  phone: NullableType<string>;

  @Column({ name: 'fcm_token', type: 'text', nullable: true })
  fcmToken: NullableType<string>;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: NullableType<string>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: NullableType<Date>;
}
