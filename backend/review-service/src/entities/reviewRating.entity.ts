import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Review } from "./review.entity";

@Entity({ schema: 'review_dba', name: 'review_ratings' })
export class ReviewRating {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ratingValue: number;

    @ManyToOne(() => Review, review => review.ratings, { eager: true })
    @JoinColumn({ name: 'review_id' })
    review: Review;
}
