export enum OrderEvent {
  Delivering = 'delivering',
  Delivered = 'delivered',
  FailedDelivery = 'failed_delivery',
  Unhandled = 'unhandled',
}

export type OrderEventData = {
  orderCode: string;
  isUserCancelled: boolean;
  duration: number;
  timestamps: {
    pickup?: number;
    completion?: number;
    cancel?: number;
  };
  cancelInfo?: {
    reason?: string;
  };
  images: {
    pickupUrl?: string;
    deliveryUrl?: string;
  };
  trackingUrl?: string;
};
