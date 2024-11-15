/**
 * SENDGRID DYNAMIC PAYLOAD
 */
export interface OrderMailPayload {
  to: string[];
  user_name: string;
  store_name: string;
  order_code: string;
  order_time: string;
  total_sub_amount: string;
  shipping_fee: string;
  discount_shipping_fee: string;
  voucher: string;
  total_paid: string;
  items: Record<string, any>;
  link?: string;
  voucher_ids: string[];
}

export interface OrderInvoiceMailPayload {
  user_name: string;
  order_code: string;
  invoice_cus_name: string;
  invoice_company_name: string;
  tax_code: string;
  invoice_location: string;
  invoice_email: string;
  total_paid: string;
}
