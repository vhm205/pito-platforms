import { StoreOrderInvoiceStatus, StoreOrderPaymentStatus } from '@gateway/enums/status';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform, Type } from 'class-transformer';

import { StoreDto as BaseStoreDto } from './common.dto';

class StoreDto extends BaseStoreDto {
  @ApiProperty({
    description:
      'Indicates whether the store is VAT registered and applies VAT on its products or services',
    example: true,
    type: Boolean,
  })
  @Expose()
  isVat: boolean;

  @ApiProperty({
    description: 'Bank account information of the store',
    example: {
      bankName: 'Techcombank',
      bankBranch: 'Ho Chi Minh',
      accountHolder: 'Tran Minh Quang',
      accountNumber: '89898989899999',
    },
    type: Object,
  })
  @Expose()
  bankAccount: {
    bankName: string;
    bankBranch: string;
    accountHolder: string;
    accountNumber: string;
  };
}

export class StoreOrderListingDto {
  @ApiProperty({
    description: 'Unique identifier for the store order',
    example: '1',
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Unique identifier for the order',
    example: '1',
    type: String,
  })
  @Expose()
  orderId: string;

  @ApiProperty({
    description: 'Unique code for the order',
    example: 'XP1234',
    type: String,
  })
  @Expose()
  orderCode: string;

  @ApiProperty({
    description: 'Total amount of the order in the specified currency',
    example: 1000,
    type: Number,
  })
  @Expose({ name: 'totalPrice' })
  totalAmount: number;

  @ApiProperty({
    description: 'Current status of the order',
    example: 1,
    type: Number,
  })
  @Expose({ name: 'statusCode' })
  status: number;

  @ApiProperty({
    description:
      'Status of the invoice request. 0: Not requested, 1: Requested but not available, 2: Requested and available',
    example: StoreOrderInvoiceStatus.NOT_REQUESTED,
    enum: StoreOrderInvoiceStatus,
  })
  @Expose()
  invoiceStatus: StoreOrderInvoiceStatus;

  @ApiProperty({
    description: 'Status of the payment. 0: NOT_PAID, 1: PAID, 2: REFUNDED',
    example: StoreOrderPaymentStatus.PAID,
    enum: StoreOrderPaymentStatus,
  })
  @Expose()
  paymentStatus: StoreOrderPaymentStatus;

  @ApiProperty({
    description: 'Date and time when the order delivery is expected to be completed',
    example: '2021-07-01T10:00:00Z',
    type: Date,
  })
  @Expose()
  deliveryDate: Date;

  @ApiProperty({
    description: 'Details of the store where the order was placed',
    type: StoreDto,
  })
  @Expose()
  @Type(() => StoreDto)
  @Transform(({ value }) => plainToInstance(StoreDto, value))
  store: StoreDto;
}
