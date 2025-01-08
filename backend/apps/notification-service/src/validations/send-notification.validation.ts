import { Channel, PushType } from '@app/common/enums';
import {
  SendNotificationDto,
  PushNotificationDto,
  SendEmailDto,
} from '@app/common/types/notification';
import { z, ZodType } from 'zod';

/**
 * PUSH NOTIFICATION
 */
const androidConfigSchema = z
  .object({
    collapseKey: z.string().trim(),
    priority: z.union([z.literal('normal'), z.literal('high')]),
    ttl: z.number().int(),
    restrictedPackageName: z.string().trim(),
    data: z.record(z.string(), z.unknown()),
    notification: z.record(z.string(), z.unknown()),
    fcmOptions: z.record(z.string(), z.unknown()),
  })
  .partial();

const apnsConfigSchema = z
  .object({
    headers: z.record(z.string(), z.string()),
    payload: z.record(z.string(), z.unknown()),
    fcm_options: z.record(z.string(), z.unknown()),
  })
  .partial();

const platformsSchema = z
  .object({
    apns: apnsConfigSchema,
    android: androidConfigSchema,
  })
  .partial();

export const pushNotificationSchema = z
  .object(
    {
      type: z.nativeEnum(PushType, {
        message: 'Invalid push type',
      }),
      topic: z.string().optional(),
      platforms: platformsSchema,
      data: z.record(z.string(), z.unknown()).optional(),
    },
    { message: 'Invalid push notification payload' },
  )
  .refine(
    ({ type, topic }) => {
      if (type === PushType.TOPIC) {
        return !!topic;
      }

      return true;
    },
    {
      message: 'Invalid topic for push notification',
      path: ['topic'], // Set error path to message
    },
  ) satisfies ZodType<PushNotificationDto>;

/**
 * EMAIL
 */
const emailFromSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Invalid from email' }),
});

export const sendEmailSchema = z.object(
  {
    from: emailFromSchema.or(z.string().email({ message: 'Invalid from email' })),
    to: z
      .array(z.string().email({ message: 'Invalid to email' }))
      .or(z.string().email({ message: 'Invalid to email' })),
    subject: z.string().optional(),
    templateId: z.string({ message: 'Invalid template id of sendgrid' }).trim(),
    dynamicTemplateData: z.record(z.string(), z.any()),
  },
  { message: 'Invalid send email payload' },
) satisfies ZodType<SendEmailDto>;

/**
 * SEND NOTIFICAITON DTO
 */
const messageSchema = z
  .object(
    {
      email: sendEmailSchema,
      pushNotification: pushNotificationSchema,
    },
    { message: 'Invalid notification message' },
  )
  .partial();

export const sendNotificationSchema = z
  .object(
    {
      notificationType: z.string({ message: 'Invalid notification type' }).trim(),
      channels: z.array(z.nativeEnum(Channel, { message: 'Invalid channel' })).min(1),
      message: messageSchema,
      metadata: z.record(z.string(), z.unknown()).optional(),
    },
    { message: 'Invalid notification payload' },
  )
  .refine(
    ({ channels, message }) => {
      if (channels.includes(Channel.EMAIL)) {
        const isValid = !!messageSchema.safeParse(messageSchema.parse(message.email)).success;
        return isValid;
      }

      if (channels.includes(Channel.PUSH)) {
        const isValid = !!messageSchema.safeParse(messageSchema.parse(message.pushNotification))
          .success;
        return isValid;
      }

      return true;
    },
    {
      message:
        // eslint-disable-next-line max-len
        'Email message is required for email channel and pushNotification message is required for push channel',
      path: ['message'],
    },
  ) satisfies ZodType<SendNotificationDto>;
