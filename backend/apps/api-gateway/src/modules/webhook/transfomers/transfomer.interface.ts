import { WebhookEvent } from '../types';

export interface WebhookEventTransformer<T> {
  canHandle(body: any): boolean;
  transform(body: any): WebhookEvent<T>;
}
