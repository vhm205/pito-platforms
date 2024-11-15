import { retryOperation, type PushNotificationDto, type SendEmailDto } from '@app/common';
import { LoggerService } from '@app/common';
import type { ExternalConfig } from '@app/common/configs';
import { PushType } from '@app/common/enums';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { BaseMessage, TopicMessage, AndroidConfig, ApnsConfig } from 'firebase-admin/messaging';

import { firebaseMessaging } from './utils/firebase';

@Injectable()
export class NotificationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const apiKey = this.configService.get<ExternalConfig>('external.sendgrid.apiKey', {
      infer: true,
    });
    SendGrid.setApiKey(apiKey);
  }

  async sendEmail(payload: SendEmailDto): Promise<{ success: boolean }> {
    return await retryOperation(async () => {
      await SendGrid.send(payload);
      return { success: true };
    });
  }

  async pushNotification(payload: PushNotificationDto): Promise<{ success: boolean }> {
    return await retryOperation(async () => {
      const baseMessage: BaseMessage = {};
      const { type, topic, platforms, data } = payload;
      const { apns, android } = platforms;

      baseMessage.data ??= data;
      baseMessage.android ??= android as AndroidConfig;
      baseMessage.apns ??= apns as ApnsConfig;

      switch (type) {
        case PushType.TOPIC: {
          const topicMessage: TopicMessage = {
            ...baseMessage,
            topic: topic!,
          };
          await firebaseMessaging.send(topicMessage);
          return { success: true };
        }
        default: {
          this.logger.error(`Unknown push notification type: ${type}`);
          return { success: false };
        }
      }
    });
  }
}
