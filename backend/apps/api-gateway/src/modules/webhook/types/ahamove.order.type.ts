export type AhamoveOrderStatus =
  | 'IDLE'
  | 'ASSIGNING'
  | 'ACCEPTED'
  | 'IN PROCESS'
  | 'COMPLETED'
  | 'CANCELLED';

type OrderCallbackPath = {
  address: string;
  name: string;
  mobile: string;
  status: string;
  tracking_number: string;
  complete_time?: number;
  pop_info?: string;
  pod_info?: string; // when status in delivery is 'COMPLETED'
  pof_info?: string; // when status in delivery is 'FAILED'

  fail_comment?: string;
  fail_time?: number;
};

export type AhamoveOrderCallback = {
  _id: string;
  accept_time: number;
  board_time: number;
  cancel_by_user: boolean;
  cancel_comment: string;
  cancel_image_url: string;
  cancel_time: number;
  city_id: string;
  complete_time: number;
  create_time: number;
  currency: string;
  order_time: number;
  partner: string;
  path: OrderCallbackPath[];
  payment_method: string;
  pickup_time: number;
  service_id: string;
  status: AhamoveOrderStatus;
  sub_status: string;
  supplier_id: string;
  supplier_name: string;
  surcharge: number;
  user_id: string;
  user_name: string;
  total_pay: number;
  promo_code: string;
  stoppoint_price: number;
  special_request_price: number;
  vat: number;
  distance_price: number;
  voucher_discount: number;
  subtotal_price: number;
  total_price: number;
  surge_rate: number;
  api_key: string;
  shared_link: string;
  insurance_portal_url: string;
  app: string;
  store_id: number;
  distance: number;
};
