import { WebhookEvent } from '@gateway/modules/webhook/types';

export interface WebhookEventTransformer<T> {
  transform(body: unknown): WebhookEvent<T>;
}
