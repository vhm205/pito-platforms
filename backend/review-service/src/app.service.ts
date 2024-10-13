import { Injectable } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { SubOrder } from './entities/subOrder.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(SubOrder)  // Assuming an Order repository to fetch order details
    private readonly orderRepository: Repository<SubOrder>,
  ) {}

  // Submit a review
  async submitReview(partnerId: number, customerId: string, rating: number, comment: string): Promise<Review> {
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
