import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Review } from '../entities/review.entity';
import { SubOrder } from './subOrder.entity';

@Entity({ schema: 'review_dba', name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column()
  externalCustomerId: string;

  @OneToMany(() => Review, review => review.customer)
  reviews: Review[];
  
  @OneToMany(() => SubOrder, order => order.partner)
  orders: SubOrder[];
}