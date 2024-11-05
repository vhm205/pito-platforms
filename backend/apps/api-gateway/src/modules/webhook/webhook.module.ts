import { Module } from '@nestjs/common';

import { TransformerModule } from './transfomers';
import { AhamoveWebhookController } from './controllers';
import { OrderEventsService } from './services';

@Module({
  imports: [TransformerModule],
  controllers: [AhamoveWebhookController],
  providers: [OrderEventsService],
  exports: [OrderEventsService],
})
export class WebhookModule {}
