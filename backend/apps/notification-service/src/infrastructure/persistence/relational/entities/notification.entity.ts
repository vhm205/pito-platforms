import { EntityRelationalHelper } from '@app/common';
import { NotificationStatus, NotificationType } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class NotificationEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'user_id',
  })
  userId: string;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @Column({ type: 'text', name: 'title' })
  title: string;

  @Column({ type: 'text', name: 'message' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    name: 'type',
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
    name: 'status',
  })
  status: NotificationStatus;

  @Column({
    type: 'timestamp',
    nullable: false,
    name: 'send_at',
  })
  sendAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'read_at',
  })
  readAt: NullableType<Date>;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'metadata',
  })
  metadata: NullableType<Record<string, unknown>>;
}
