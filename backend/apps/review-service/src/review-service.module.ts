import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';

import { ReviewServiceController } from './review-service.controller';
import { ReviewServiceService } from './review-service.service';

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
