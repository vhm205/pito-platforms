/*
 * NOTIFICATION
 */
export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  READ = 'read',
}

export enum NotificationType {
  ORDER_DELIVERY = 'order_delivery',
  ORDER_COMPLETE = 'order_complete',
  ORDER_NOT_PAY = 'order_not_pay',
}

/*
 * EMAIL, PUSH
 */
export enum Channel {
  EMAIL = 'email',
  PUSH = 'push',
}

export enum PushType {
  TOPIC = 'topic',
}

export enum NotificationEventPattern {
  SEND = 'notification.send',
}

export enum NotificationType {
  ORDER_STATUS_UPDATE = 'OrderStatusUpdate',
}
