import { LoggerService } from '@app/common';
import { Channel, NotificationEventPattern } from '@app/common/enums';
import { ZodValidationPipe } from '@app/common/pipes';
import { SendNotificationDto } from '@app/common/types/notification';
import {
  GetTotalNotificationRequest,
  GetTotalNotificationResponse,
  NotificationServiceControllerMethods,
} from '@app/common/types/proto/notification';
import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import * as Sentry from '@sentry/nestjs';

import { NotificationService } from './notification.service';
import { sendNotificationSchema } from './validations/send-notification.validation';

@Controller()
@NotificationServiceControllerMethods()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: LoggerService,
  ) {}

  async getTotalNotification(
    request: GetTotalNotificationRequest,
  ): Promise<GetTotalNotificationResponse> {
    return this.notificationService.getTotalNotification(request);
  }

  @EventPattern(NotificationEventPattern.SEND)
  async sendNotification(@Payload() payload: SendNotificationDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log('Received send notification event', {
      metadata: payload,
    });

    try {
      const parsedValue = new ZodValidationPipe(sendNotificationSchema).transform(payload);
      const { channels, message } = parsedValue;

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
      this.logger.error('Failed to process send notification', {
        metadata: error,
      });
      Sentry.captureException(error);
      channel.nack(originalMessage, false, false);
    }
  }
}
