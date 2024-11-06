import { PushType, Channel } from '../enums';

export interface EmailFromDto {
  name?: string;
  email: string;
}

export interface SendEmailDto {
  from: EmailFromDto | string;
  to: string | string[];
  subject?: string;
  templateId: string;
  dynamicTemplateData: Record<string, any>;
}

export interface PushNotificationDto {
  type: PushType;
  topic?: string;
  apns?: Record<string, any>;
  android?: Record<string, any>;
  data: Record<string, any>;
}

interface Message {
  email?: SendEmailDto;
  pushNotification?: PushNotificationDto;
}

export interface SendNotificationDto {
  notificationType: string;
  channels: Channel[];
  message: Message;
  metadata?: Record<string, any>;
}
