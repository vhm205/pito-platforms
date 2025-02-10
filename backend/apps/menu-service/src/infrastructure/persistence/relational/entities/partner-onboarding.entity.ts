import { EntityRelationalHelper } from '@app/common';
import { OnboardingStatus, PartnerType } from '@app/common/enums/partner';
import { NullableType } from '@app/common/types/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'partner_onboarding' })
export class PartnerOnboardingEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: NullableType<Date>;

  @Column('jsonb', { name: 'raw_owner_metadata', nullable: false })
  rawOwnerMetadata: object;

  @Column('jsonb', { name: 'raw_business_metadata', nullable: false })
  rawBusinessMetadata: object;

  @Column('jsonb', { name: 'raw_bank_account_metadata', nullable: false })
  rawBankAccountMetadata: object;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OnboardingStatus,
    nullable: false,
  })
  status: OnboardingStatus;

  @Column('text', { name: 'email_confirmation', nullable: false })
  emailConfirmation: string;

  @Column({
    name: 'partner_type',
    type: 'enum',
    enum: PartnerType,
    nullable: false,
  })
  partnerType: PartnerType;

  @Column('jsonb', { name: 'metadata', nullable: true })
  metadata: NullableType<object>;
}
