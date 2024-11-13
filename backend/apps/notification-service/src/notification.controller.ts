import { EmailSentDto } from '@app/common';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('email-sent')
  async sendEmail(
    @Payload() emailSentDto: EmailSentDto,
    @Ctx() context: RmqContext,
  ): Promise<{ status: boolean; error?: string }> {
    const channel = context.getChannelRef();

    const originalMessage = context.getMessage();

    try {
      await this.notificationService.sendEmail(emailSentDto);

      channel.ack(originalMessage);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      channel.nack(originalMessage, false, true);
    }

    return { status: true };
  }
}
