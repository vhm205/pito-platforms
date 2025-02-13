export const RABBITMQ_CONNECTION = 'RABBITMQ_CONNECTION';

export enum RabbitMQExchange {
  ORDER_DL_EXCHANGE = 'order_dl_exchange',
  PAYMENT_DL_EXCHANGE = 'payment_dl_exchange',
  TOPIC_EXCHANGE = 'amq.topic',
  DELAYED_EXCHANGE = 'delayed_exchange',
}

export enum RabbitMQQueue {
  ORDER_DL_QUEUE = 'order_dl_queue',
  PAYMENT_DL_QUEUE = 'payment_dl_queue',
  COMPENSATION_QUEUE = 'compensation_queue',
  ORDER_QUEUE = 'order_queue',
  PAYMENT_QUEUE = 'payment_queue',
  NOTIFICATION_QUEUE = 'notification_queue',
}
