import { StoreStatus } from '@app/common/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('stores')
export class PartnerStoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'store_name', nullable: false })
  storeName: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column({
    type: 'enum',
    enum: StoreStatus,
  })
  status: StoreStatus;

  @Column({ type: 'boolean', name: 'is_vat', default: false })
  isVat: boolean;

  @Column({ type: 'text', nullable: false })
  slug: string;
}
