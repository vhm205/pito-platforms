import { PartnerStatus } from '@app/common/enums/partner';
import { NullableType } from '@app/common/types/common';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('partners')
export class PartnerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'partner_name' })
  partnerName: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'boolean', default: true, name: 'is_vat' })
  isVat: boolean;

  @Column({ type: 'smallint', nullable: true, name: 'service_fee_rate' })
  serviceFeeRate: NullableType<number>;

  @Column({ type: 'enum', enum: PartnerStatus })
  status: PartnerStatus;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;
}
