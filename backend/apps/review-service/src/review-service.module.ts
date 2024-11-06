import { Module } from '@nestjs/common';

import { ReviewServiceController } from './review-service.controller';
import { ReviewServiceService } from './review-service.service';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    LoggerModule.forRoot({
      service: ReviewServiceService.name,
    }),
  ],
  controllers: [ReviewServiceController],
  providers: [ReviewServiceService],
})
export class ReviewServiceModule {}
