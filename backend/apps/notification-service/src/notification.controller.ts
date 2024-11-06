import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import * as Sentry from '@sentry/nestjs';

import { Channel } from '@app/common/enums';
import { SendNotificationDto } from '@app/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('notification.sent')
  async sendNotification(@Payload() payload: SendNotificationDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { channels, message } = payload;

      if (channels.length === 0) {
        Sentry.captureMessage("Channels must be defined, otherwise it won't be sent", {
          level: 'warning',
          extra: payload as any,
        });
        return channel.ack(originalMessage);
      }

      const asyncSendNotifications = channels.map(channel => {
        switch (channel) {
          case Channel.EMAIL: {
            return this.notificationService.sendEmail(message.email);
          }
          case Channel.PUSH: {
            return this.notificationService.pushNotification(message.pushNotification);
          }
        }
      });
      await Promise.all(asyncSendNotifications);

      channel.ack(originalMessage);
    } catch (error) {
      console.error('Failed to process send notification', error);
      Sentry.captureException(error);
      channel.nack(originalMessage, false, false);
    }
  }
}
