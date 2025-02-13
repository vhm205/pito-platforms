import { ServiceFeeUnit, SourceSystemType, StoreOrderStatus } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';
import { StoreOrder as StoreOrderMessage } from '@app/common/types/proto/order';

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
  images: string[];
  quantity: number;
  base_price: number;
  selected_options: Array<{
    name: string;
    selected_choices: Array<{
      name: string;
      price: number;
      quantity: number;
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
  invoiceStatus: number;
  paymentStatus: number;
  statusCode: number;
  createdAt: Date;
  updatedAt: NullableType<Date>;
  deliveryDate: Date;
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

  toMessage(): StoreOrderMessage {
    return {
      id: this.id,
      storeId: this.storeId,
      orderId: this.orderId,
      status: this.status,
      statusCode: this.statusCode,
      orderCode: this.orderCode,
      totalPrice: this.totalPrice,
      invoiceStatus: this.invoiceStatus,
      paymentStatus: this.paymentStatus,
      deliveryDate: this.deliveryDate,
      invoiceRequest: {
        taxCode: this.invoiceRequest?.tax_code ?? '',
        companyName: this.invoiceRequest?.company_name ?? '',
        address: this.invoiceRequest?.address ?? '',
        email: this.invoiceRequest?.email ?? '',
      },
      metadata: {
        invoiceUrl: this.metadata.invoice_url ?? '',
      },
    };
  }
}
