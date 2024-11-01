import { Module } from '@nestjs/common';

import { OrderEventHandler } from './order.event';

@Module({
  providers: [OrderEventHandler],
  exports: [OrderEventHandler],
})
export class WebhookEventsModule {}
