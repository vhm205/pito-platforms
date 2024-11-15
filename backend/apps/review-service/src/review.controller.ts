import { Empty, ReviewsServiceController } from '@app/common/types/proto/review';
import { Controller, Get } from '@nestjs/common';

import { ReviewService } from './review.service';

@Controller()
export class ReviewController implements ReviewsServiceController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  getHello(): string {
    return this.reviewService.getHello();
  }

  async findReviews(dto: Empty): Promise<Empty> {
    return dto;
  }
}
