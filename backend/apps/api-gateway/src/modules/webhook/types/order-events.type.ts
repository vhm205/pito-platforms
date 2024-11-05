export enum OrderEvent {
  Delivering = 'delivering',
  Delivered = 'delivered',
  FailedDelivery = 'failed_delivery',
  Unhandled = 'unhandled',
}

export type OrderEventData = {
  orderCode: string;
  isCancelledByUser: boolean;
  pickupTimestamp?: number;
  completionTimestamp?: number;
  cancelTimestamp?: number;
  cancelReason?: string;
  images: {
    pickupImageUrl?: string;
    deliveryImageUrl?: string;
  };
};
