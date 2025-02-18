import { SelectedOption } from './create-order.dto';

/**
 * SENDGRID DYNAMIC PAYLOAD
 */
export interface OrderMailItem {
  item_name: string;
  item_amount: string;
  count: number;
  notes: string;
  item_options: SelectedOption[];
}

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
  items: OrderMailItem[];
  link?: string;
  voucher_ids: string[];
  is_service_person: boolean;
  is_service_time: boolean;
  total_services_amount: string;
  service_time: Record<string, any>;
  service_person: Record<string, any>;
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
