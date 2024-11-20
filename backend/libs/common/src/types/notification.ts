import { PushType, Channel } from '../enums';

/**
 * SEND EMAIL
 */
export interface EmailFromDto {
  name?: string;
  email: string;
}

export interface SendEmailDto {
  from: string | EmailFromDto;
  to: string | string[];
  subject?: string;
  templateId: string;
  dynamicTemplateData: Record<string, any>;
}

/**
 * PUSH NOTIFICAITON
 */
export interface AndroidConfig {
  collapseKey: string;
  priority: 'normal' | 'high';
  ttl: number;
  restrictedPackageName: string;
  data: Record<string, unknown>;
  notification: Record<string, unknown>;
  fcmOptions: Record<string, unknown>;
}

export interface ApnsConfig {
  headers: Record<string, unknown>;
  payload: Record<string, unknown>;
  fcmOptions: Record<string, unknown>;
}

export interface Platforms {
  apns: Partial<ApnsConfig>;
  android: Partial<AndroidConfig>;
}

export interface PushNotificationDto {
  type: PushType;
  topic?: string;
  platforms: Partial<Platforms>;
  data?: Record<string, any>;
}

/**
 * SEND NOTIFICAITON DTO
 */
interface Message {
  email: SendEmailDto;
  pushNotification: PushNotificationDto;
}

export interface SendNotificationDto<T = Record<string, unknown>> {
  notificationType: string;
  channels: Channel[];
  message: Partial<Message>;
  metadata?: T;
}
