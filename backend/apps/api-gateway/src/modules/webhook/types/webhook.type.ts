export type WebhookEvent<T> = {
  type: string;
  timestamp: string;
  data: T;
};
