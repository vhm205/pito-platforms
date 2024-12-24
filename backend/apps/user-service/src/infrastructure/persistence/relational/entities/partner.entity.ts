import { PartnerStatus, PartnerType, ServiceType } from '@app/common/enums/partner';
import { NullableType } from '@app/common/types/common';
import {
  BankAccount,
  BusinessInfo,
  BusinessOwner,
} from 'apps/user-service/src/domain/partner.domain';
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

  @Column({ name: 'partner_name', type: 'text' })
  partnerName: string;

  @Column({ name: 'partner_type', type: 'enum', enum: PartnerType })
  partnerType: PartnerType;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PartnerStatus,
  })
  status: PartnerStatus;

  @Column({ name: 'bank_account', type: 'jsonb', nullable: true })
  bankAccount: NullableType<BankAccount>;

  @Column({ name: 'business_info', type: 'jsonb', nullable: true })
  businessInfo: NullableType<BusinessInfo>;

  @Column({ name: 'business_owner', type: 'jsonb', nullable: true })
  businessOwner: NullableType<BusinessOwner>;

  @Column({
    name: 'service_types',
    type: 'enum',
    enum: ServiceType,
    array: true,
    nullable: true,
  })
  serviceTypes: ServiceType[];

  @Column({ name: 'service_fee_rate', type: 'smallint', nullable: true })
  serviceFeeRate: NullableType<number>;

  @Column({ name: 'is_vat', type: 'boolean', default: true })
  isVat: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: NullableType<Date>;
}
