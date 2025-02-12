import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('store_users')
export class StoreUserRelationship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'partner_id', type: 'uuid', primary: true })
  partnerId: string;

  @Column({ name: 'store_id', type: 'uuid', primary: true })
  userId: string;

  @Column({ name: 'is_banded', type: 'boolean' })
  isBanned: boolean;
}
