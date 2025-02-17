import { EntityRelationalHelper } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { RawOptionChoice } from 'apps/order-service/src/domain';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { ItemEntity } from './item.entity';

@Entity('cart_items')
export class CartItemEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => ItemEntity)
  @JoinColumn({ name: 'item_id' })
  item: ItemEntity;

  @Column({ type: 'uuid', name: 'session_id' })
  sessionId: string;

  @Column({ type: 'uuid', name: 'item_id' })
  itemId: string;

  @Column({ type: 'smallint', name: 'quantity' })
  quantity: number;

  @Column({ type: 'jsonb', name: 'raw_options_choices' })
  rawOptionsChoices: Array<RawOptionChoice>;

  @Column({ type: 'text', name: 'notes', nullable: true })
  notes: NullableType<string>;

  @Column({ type: 'numeric', name: 'total_price' })
  totalPrice: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;
}
