import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Partner } from '../entities/partner.entity';
import { Customer } from '../entities/customer.entity';

@Entity({ schema: 'review_dba', name: 'reviews' })
export class SubOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'external_order_id' , length: 255})
  externalOrderId: string;

  @OneToMany(() => Review, review => review.order)
  reviews: Review[];

  @ManyToOne(() => Partner, partner => partner.orders, { eager: true })
  @JoinColumn({ name: 'partner_id' }) 
  partner: Partner;

  @ManyToOne(() => Customer, customer => customer.orders, { eager: true })
  @JoinColumn({ name: 'customer_id' }) 
  customer: Customer;
}


