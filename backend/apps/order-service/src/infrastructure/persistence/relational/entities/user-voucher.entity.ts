import { Entity, Column, CreateDateColumn } from 'typeorm';

@Entity('user_vouchers')
export class UserVoucherEntity {
  @Column({ type: 'uuid', name: 'user_id', primary: true })
  userId: string;

  @Column({ type: 'uuid', name: 'voucher_id', primary: true })
  voucherId: string;

  @Column({ type: 'numeric', name: 'usage_count' })
  usageCount: string;

  // @ManyToOne(() => User, user => user.userVouchers) // Define the many-to-one relationship
  // @JoinColumn({ name: 'user_id' }) // Specify the foreign key column
  // user: User;

  // @ManyToOne(() => Voucher, voucher => voucher.userVouchers) // Define the many-to-one relationship
  // @JoinColumn({ name: 'voucher_id' }) // Specify the foreign key column
  // voucher: Voucher;

  @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt: Date | string;
}
