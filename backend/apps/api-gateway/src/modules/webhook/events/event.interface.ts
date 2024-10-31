import { Request } from 'express';

import { WebhookEvent } from '../types';

export interface WebhookEventHandler {
  authenticate(req: Request): boolean;
  transformEvent(event: any): any;
  processEvent(event: any): Promise<void>;
}

export interface WebhookEventTransformer<T> {
  canHandle(body: any): boolean;
  transform(body: any): WebhookEvent<T>;
}

export interface WebhookAuthStrategy {
  authenticate(req: Request): boolean;
}
