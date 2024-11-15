import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';

import { PromotionServiceController } from './promotion-service.controller';
import { PromotionServiceService } from './promotion-service.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      service: PromotionServiceService.name,
    }),
  ],
  controllers: [PromotionServiceController],
  providers: [PromotionServiceService],
})
export class PromotionServiceModule {}
