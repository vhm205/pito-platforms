import { SetMetadata } from '@nestjs/common';

export const WebhookAuth = (key: string) => SetMetadata('whSecret', key);
