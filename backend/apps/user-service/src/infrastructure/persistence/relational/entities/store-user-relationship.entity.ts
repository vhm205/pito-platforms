import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('store_users')
export class StoreUserRelationship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'store_id', type: 'uuid' })
  storeId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'is_banned', type: 'boolean' })
  isBanned: boolean;
}
