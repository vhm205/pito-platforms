export enum OrderEvent {
  Delivering = 'delivering',
  Delivered = 'delivered',
  NotDelivered = 'not_delivered',
}

export type OrderEventData = { id: string };

type AhamoveOrderStatus =
  | 'IDLE'
  | 'ASSIGNING'
  | 'ACCEPTED'
  | 'IN PROCESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type AhamoveOrderCallback = {
  _id: string;
  order_id: string;
  service_id: string;
  status: AhamoveOrderStatus;
  cancel_time: number;
  cancel_comment: string;
  cancel_image_url?: string;
  complete_time: number;
};
