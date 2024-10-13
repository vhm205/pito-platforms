import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('reviews')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Submit a review
  @Post(':partnerId')
  submitReview(
    @Param('partnerId') partnerId: number,
    @Body('customerId') customerId: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
  ) {
    return this.appService.submitReview(partnerId, customerId, rating, comment);
  }

  // Get all reviews for a specific partner
  @Get(':partnerId')
  async getReviews(@Param('partnerId') partnerId: string) {
    const response = await this.appService.getReviewsByExternalPartnerId(partnerId);
    console.log(response);
    return response;
  }
}
