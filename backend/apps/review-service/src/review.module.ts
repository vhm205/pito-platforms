import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';

import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      service: ReviewService.name,
    }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
