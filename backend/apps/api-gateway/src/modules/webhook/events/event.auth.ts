import { Request } from 'express';

import { WebhookAuthStrategy } from './event.interface';

export class AhamoveAuthStrategy implements WebhookAuthStrategy {
  protected apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  authenticate(req: Request): boolean {
    const apiKey =
      req.headers['apikey']?.toString() ?? req.headers['authorization']?.replace('Bearer ', '');
    return apiKey === this.apiKey;
  }
}
