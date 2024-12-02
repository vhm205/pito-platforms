import { VoucherType, VoucherUnit } from '@app/common/enums';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('vouchers')
export class VoucherEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt: Date | string;

  @Column({ type: 'enum', enum: VoucherType, name: 'type' })
  type: VoucherType;

  @Column({ type: 'numeric', name: 'value' })
  value: string;

  @Column({ type: 'enum', enum: VoucherUnit, name: 'value_unit' })
  valueUnit: VoucherUnit;

  @Column({ type: 'timestamptz', nullable: false, name: 'valid_until' })
  validUntil: Date;

  @Column({ type: 'timestamptz', nullable: false, name: 'valid_from' })
  validFrom: Date;

  @Column({ type: 'numeric', nullable: true, name: 'max_usage' })
  maxUsage: string;

  @Column({ type: 'text', unique: true, name: 'voucher_code' })
  voucherCode: string;

  @Column({ type: 'text', name: 'voucher_name' })
  voucherName: string;
}
