import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Partner } from '../entities/partner.entity';
import { SubOrder } from '../entities/subOrder.entity';
import { ReviewRating } from './reviewRating.entity';

@Entity({ schema: 'review_dba', name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column({ type: 'varchar', length: 50, default: 'published' })
  status: string;

  @Column({ type: 'timestamp', name: 'created_at' , default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({type: 'varchar', length: 50, name: 'source_system'})
  sourceSystem: string;

  @Column({type: 'text', name: 'review_photos'})
  reviewPhotos: string[];

  @Column({type: 'decimal', name: 'avg_rating_value'})
  avgRatingValue: number;

  @ManyToOne(() => SubOrder, subOrder => subOrder.reviews, { eager: true })
  @JoinColumn({ name: 'order_id' })
  order: SubOrder;

  @ManyToOne(() => Partner, partner => partner.reviews, { eager: true })
  @JoinColumn({ name: 'partner_id' }) 
  partner: Partner;

  @ManyToOne(() => Customer,  customer => customer.reviews, { eager: true })
  @JoinColumn({ name: 'customer_id' }) 
  customer: Customer;

  @OneToMany(() => ReviewRating, reviewRating => reviewRating.review)
  ratings: ReviewRating[];
}
