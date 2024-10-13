import { Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  // Submit a review
  submitReview(partnerId: number, customerId: string, rating: number, comment: string): Review {
    return null
  }
  async getReviewsByExternalPartnerId(externalPartnerId: string): Promise<Review[]> {
    return this.reviewRepository.createQueryBuilder('review')
      .innerJoinAndSelect('review.partner', 'partner')
      .where('partner.external_partner_id = :externalPartnerId', { externalPartnerId })
      .getMany();
  }
  
  async findById(id: number): Promise<Review> {
    return this.reviewRepository.findOneBy({ id });
  }
}
