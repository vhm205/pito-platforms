import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import * as Sentry from '@sentry/nestjs';

import { Channel } from '@app/common/enums';
import { LoggerService, SendNotificationDto } from '@app/common';
import { ZodValidationPipe } from '@app/common/pipes';
import { NotificationService } from './notification.service';
import { sendNotificationSchema } from './dtos/send-notification.dto';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: LoggerService,
  ) {}

  @EventPattern('notification.sent')
  async sendNotification(
    @Payload(new ZodValidationPipe(sendNotificationSchema)) payload: SendNotificationDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { channels, message } = payload;

      const asyncSendNotifications = channels.map(channel => {
        switch (channel) {
          case Channel.EMAIL: {
            return this.notificationService.sendEmail(message.email!);
          }
          case Channel.PUSH: {
            return this.notificationService.pushNotification(message.pushNotification!);
          }
        }
      });
      await Promise.all(asyncSendNotifications);

      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error('Failed to process send notification', error);
      Sentry.captureException(error);
      channel.nack(originalMessage, false, false);
    }
  }
}
