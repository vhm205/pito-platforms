import { ServiceFeeUnit, SourceSystemType, StoreOrderStatus } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';

export type StoreOrderDeliveryContact = {
  email: string;
  phone: string;
  full_name: string;
};

export type StoreOrderDeliveryAddress = {
  city: string;
  ward: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
};

export type StoreOrderItem = {
  id: string;
  name: string;
  notes: string;
  images: string;
  quantity: number;
  base_price: number;
  selected_options: Array<{
    name: string;
    selected_choices: Array<{
      name: string;
      price: string;
      quantity: string;
    }>;
  }>;
};

export type StoreOrderInvoiceRequest = {
  tax_code: string;
  company_name: string;
  address: string;
  email: string;
};

export type StoreOrderLogs = {
  confirmed_at: NullableType<Date>;
  preparing_at: NullableType<Date>;
  prepared_at: NullableType<Date>;
  delivering_at: NullableType<Date>;
  delivered_at: NullableType<Date>;
  rejected_at: NullableType<Date>;
  completed_at: NullableType<Date>;
  not_confirmed_at: NullableType<Date>;
  canceled_at: NullableType<Date>;
  cancel_reasons: NullableType<string>;
};

export type StoreOrderMetadata = {
  before_delivery_images: Array<string>;
  after_delivery_images: Array<string>;
  invoice_url: NullableType<string>;
};

export type StoreOrderServiceFee = {
  unit: ServiceFeeUnit;
  amount: number;
  unit_value: number;
};

export class StoreOrder {
  id: string;
  storeId: string;
  orderId: string;
  orderCode: string;

  status: StoreOrderStatus | string;
  createdAt: Date;
  updatedAt: NullableType<Date>;
  deliveryTime: Date;
  estimationTime: number;

  deliveryContact: StoreOrderDeliveryContact;
  deliveryAddress: StoreOrderDeliveryAddress;

  orderItems: Array<StoreOrderItem>;
  subtotalPrice: number;
  shippingFee: number;
  totalPrice: number;
  serviceFee: StoreOrderServiceFee;
  orderType: SourceSystemType;

  notes: NullableType<string>;
  metadata: StoreOrderMetadata;
  invoiceRequest: NullableType<StoreOrderInvoiceRequest>;
  orderLogs: StoreOrderLogs;
}
