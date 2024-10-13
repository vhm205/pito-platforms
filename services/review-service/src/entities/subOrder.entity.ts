import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Review } from '../entities/review.entity';

@Entity({ schema: 'review_dba', name: 'reviews' })
export class SubOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'external_order_id' , length: 255})
  externalOrderId: string;

  @OneToMany(() => Review, review => review.order)
  reviews: Review[];
}


