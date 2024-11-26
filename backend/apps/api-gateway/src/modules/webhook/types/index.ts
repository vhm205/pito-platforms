export * from './order-events.type';
export * from './ahamove.order.type';
export * from './supabase-user.type';

export type WebhookEvent<T> = {
  type: string;
  timestamp: number;
  data: T;
};
