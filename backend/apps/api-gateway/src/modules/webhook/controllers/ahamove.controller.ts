import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AhamoveWebhookGuard } from '@gateway/guards/ahamove.guard';
import { AhamoveOrderTransformer } from '@gateway/modules/webhook/transfomers';
import { AhamoveOrderCallback } from '@gateway/modules/webhook/types';
import { OrderEventsService } from '@gateway/modules/webhook/services/order-events.service';
import { LoggerService } from '@app/common';

@Controller('webhook/ahamove')
@UseGuards(AhamoveWebhookGuard)
export class AhamoveWebhookController {
  constructor(
    private readonly logger: LoggerService,
    private readonly ahamoveOrderTransformer: AhamoveOrderTransformer,
    private readonly orderEventsService: OrderEventsService,
  ) {}

  @Post('order_events')
  async handleOrderEvents(@Body() payload: AhamoveOrderCallback) {
    const event = this.ahamoveOrderTransformer.transform(payload);
    if (!event.data.orderCode.startsWith('XP')) {
      const message = 'Unhandled this event. Because it is not an PITO Xpress order';
      this.logger.debug(message);
      return message;
    }

    await this.orderEventsService.processEvent(event);
    return 'Event has been processed';
  }
}
