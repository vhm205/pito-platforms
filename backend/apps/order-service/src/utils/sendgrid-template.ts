import { ReadableOrderStatus } from '@app/common/enums';

export function getOrderTemplateIds() {
  return {
    [ReadableOrderStatus.COMPLETED]: process.env.SENDGRID_ORDER_COMPLETED_TEMPLATE_ID!,
    [ReadableOrderStatus.DELIVERING]: process.env.SENDGRID_ORDER_DELIVERING_TEMPLATE_ID!,
    [ReadableOrderStatus.DELIVERY_FAILED]: process.env.SENDGRID_ORDER_DELIVERY_FAILED_TEMPLATE_ID!,
  };
}
