import { OrderStatus } from '@app/common/types/proto/common';

export function getOrderStatusTemplateIds() {
  return {
    [OrderStatus.COMPLETED]: process.env.SENDGRID_ORDER_COMPLETED_TEMPLATE_ID!,
    [OrderStatus.DELIVERING]: process.env.SENDGRID_ORDER_DELIVERING_TEMPLATE_ID!,
    [OrderStatus.DELIVERY_FAILED]: process.env.SENDGRID_ORDER_DELIVERY_FAILED_TEMPLATE_ID!,

    [OrderStatus.CANCELED]: process.env.SENDGRID_ORDER_CANCELED_TEMPLATE_ID!,
    [OrderStatus.REJECTED]: process.env.SENDGRID_ORDER_CANCELED_TEMPLATE_ID!,
    [OrderStatus.UNCONFIRMED]: process.env.SENDGRID_ORDER_CANCELED_TEMPLATE_ID!,

    [OrderStatus.PAYMENT_FAILED]: process.env.SENDGRID_PAYMENT_FAILED_TEMPLATE_ID!,
    [OrderStatus.WAITING_FOR_CONFIRMATION]: process.env.SENDGRID_ORDER_CREATE_TEMPLATE_ID!,
    [OrderStatus.WAITING_FOR_DEPOSIT]: process.env.SENDGRID_CONFIRM_PAY_LATER_TEMPLATE_ID!,
  };
}
