import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import * as Sentry from '@sentry/nestjs';
import { BaseMessage, TopicMessage, AndroidConfig, ApnsConfig } from 'firebase-admin/messaging';

import { retryOperation, type PushNotificationDto, type SendEmailDto } from '@app/common';
import type { ExternalConfig } from '@app/common/configs';
import { PushType } from '@app/common/enums';
import { SentryTag } from '@app/common/enums/sentry';
import { firebaseMessaging } from './utils/firebase';

@Injectable()
export class NotificationService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<ExternalConfig>('external.sendgrid.apiKey', {
      infer: true,
    });
    SendGrid.setApiKey(apiKey);
  }

  async sendEmail(payload: SendEmailDto): Promise<{ success: boolean }> {
    try {
      return await retryOperation(async () => {
        await SendGrid.send(payload);
        return { success: true };
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          type: SentryTag.SENDGRID,
        },
      });
      throw error;
    }
  }

  async pushNotification(payload: PushNotificationDto): Promise<{ success: boolean }> {
    try {
      return await retryOperation(async () => {
        const baseMessage: BaseMessage = {};
        const { type, topic, apns, android, data } = payload;

        baseMessage.data ??= data;
        baseMessage.android ??= android as AndroidConfig;
        baseMessage.apns ??= apns as ApnsConfig;

        switch (type) {
          case PushType.TOPIC: {
            const topicMessage: TopicMessage = {
              ...baseMessage,
              topic,
            };
            await firebaseMessaging.send(topicMessage);
            return { success: true };
          }
          default: {
            Sentry.captureMessage('Unknown push type', {
              level: 'error',
            });
            return { success: false };
          }
        }
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          type: SentryTag.FCM,
        },
      });
      throw error;
    }
  }
}
