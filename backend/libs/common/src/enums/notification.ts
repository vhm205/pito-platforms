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

export enum NotificationTemplateCode {
  ORDER_CREATED = 'IN-01',
  ORDER_WAITING_FOR_CONFIRMATION = 'IN-02',
  ORDER_CANCELLED = 'IN-03',
  ORDER_MISSING = 'IN-04',
  ORDER_PREPARED = 'IN-05',
  ORDER_DELIVERED = 'IN-06',
  ORDER_NOT_CONFIRMED = 'IN-07',
}
