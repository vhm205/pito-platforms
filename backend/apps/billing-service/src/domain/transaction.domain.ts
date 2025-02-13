import {
  PaymentGateway,
  PaymentStatus,
  PaymentType,
  ReadablePaymentMethod,
  TxErrorCode,
} from '@app/common/enums';
import { NullableType } from '@app/common/types/common';

export class Transaction {
  id: string;
  txCode: string;
  orderId: string;
  storeId: string;
  customerId: string;
  amount: number;
  description: string;
  status: PaymentStatus;
  paymentType: PaymentType;
  paymentMethod: ReadablePaymentMethod;
  paymentGateway: PaymentGateway;
  billCode: NullableType<string>;
  errorCode: TxErrorCode;
  statusMessage: NullableType<string>;
  metadata: NullableType<Record<string, any>>;
  updatedAt: NullableType<Date | string>;
  createdAt: Date | string;
}
