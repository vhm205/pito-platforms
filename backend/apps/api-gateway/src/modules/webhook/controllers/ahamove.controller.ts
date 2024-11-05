import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AhamoveWebhookGuard } from '@gateway/guards/ahamove.guard';
import { AhamoveOrderTransformer } from '@gateway/modules/webhook/transfomers';
import { AhamoveOrderCallback } from '@gateway/modules/webhook/types';
import { OrderEventsService } from '@gateway/modules/webhook/services/order-events.service';

@Controller('webhook/ahamove')
@UseGuards(AhamoveWebhookGuard)
export class AhamoveWebhookController {
  constructor(
    private readonly ahamoveOrderTransformer: AhamoveOrderTransformer,
    private readonly orderEventsService: OrderEventsService,
  ) {}

  @Post('order_events')
  async handleOrderEvents(@Body() payload: AhamoveOrderCallback) {
    const event = this.ahamoveOrderTransformer.transform(payload);
    await this.orderEventsService.processEvent(event);
    return event;
  }
}
