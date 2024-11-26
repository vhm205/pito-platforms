import { OrderStatus } from '@app/common/enums';

export function getOrderTemplateIds() {
  return {
    [OrderStatus.COMPLETED]: process.env.SENDGRID_ORDER_COMPLETED_TEMPLATE_ID!,
    [OrderStatus.DELIVERING]: process.env.SENDGRID_ORDER_DELIVERING_TEMPLATE_ID!,
    [OrderStatus.DELIVERY_FAILED]: process.env.SENDGRID_ORDER_DELIVERY_FAILED_TEMPLATE_ID!,
  };
}
