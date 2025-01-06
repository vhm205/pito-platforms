import { EntityRelationalHelper } from '@app/common';
import { MaybeType } from '@app/common/types/common';
import {
  BankAccountInfo,
  BusinessInfo,
  BusinessOwner,
} from 'apps/menu-service/src/domain/partner.domain';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity('partners')
export class PartnerEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'partner_name', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  status: string;

  @Column({ type: 'smallint', name: 'service_fee_rate' })
  serviceFeeRate: number;

  @Column({ type: 'smallint', name: 'business_type' })
  businessType: number;

  @Column({ type: 'smallint' })
  certification: number;

  @Column({ type: 'jsonb', name: 'bank_account', nullable: false })
  bankAccount: BankAccountInfo;

  @Column({ type: 'jsonb', name: 'business_info', nullable: false })
  businessInfo: BusinessInfo;

  @Column({ type: 'jsonb', name: 'business_owner', nullable: false })
  businessOwner: BusinessOwner;

  @CreateDateColumn({ name: 'created_at', type: 'time with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'time with time zone', nullable: true })
  updatedAt: MaybeType<Date>;
}
