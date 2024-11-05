import { Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('order_events')
  @HttpCode(HttpStatus.OK)
  async handleOrderEvents(@Req() req: Request) {
    await this.webhookService.processEvent('order_events', req);
    return 'OK';
  }

  @Post('user_events')
  @HttpCode(HttpStatus.OK)
  async handleUserEvents(@Req() req: Request) {
    await this.webhookService.processEvent('user_events', req);
    return 'OK';
  }

  @Post('payment_events')
  @HttpCode(HttpStatus.OK)
  async handlePaymentEvents(@Req() req: Request) {
    await this.webhookService.processEvent('payment_events', req);
    return 'OK';
  }
}
