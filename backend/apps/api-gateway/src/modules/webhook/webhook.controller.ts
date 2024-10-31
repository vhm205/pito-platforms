import { Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('order_events')
  @HttpCode(HttpStatus.OK)
  async handleOrderEvents(@Req() req: Request, @Res() res: Response) {
    await this.webhookService.processEvent('order_events', req);
    return res.send('OK');
  }

  @Post('user_events')
  @HttpCode(HttpStatus.OK)
  async handleUserEvents(@Req() req: Request, @Res() res: Response) {
    await this.webhookService.processEvent('user_events', req);
    return res.send('OK');
  }

  @Post('payment_events')
  @HttpCode(HttpStatus.OK)
  async handlePaymentEvents(@Req() req: Request, @Res() res: Response) {
    await this.webhookService.processEvent('payment_events', req);
    return res.send('OK');
  }
}
