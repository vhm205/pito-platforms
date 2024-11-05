export * from './order-events.type';
export * from './ahamove.order.type';

export type WebhookEvent<T> = {
  type: string;
  timestamp: string;
  data: T;
};
