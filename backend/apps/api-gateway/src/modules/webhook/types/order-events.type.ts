export enum OrderEvent {
  Delivering = 'delivering',
  Delivered = 'delivered',
  NotDelivered = 'not_delivered',
}

export type OrderEventData = {
  order_code: string;
  cancel_by_user: boolean;
  cancel_comment: string;
  cancel_image_url: string;
  cancel_time: number;
};
