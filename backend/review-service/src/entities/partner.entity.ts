import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Review } from '../entities/review.entity';

@Entity({ schema: 'review_dba', name: 'partners' })
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', name: 'profile_picture',  length: 255, nullable: true })
  profilePicture: string;

  @OneToMany(() => Review, review => review.partner)
  reviews: Review[];
}
