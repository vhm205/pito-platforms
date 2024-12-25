import { paymentMethodToReadable } from '@app/common';
import { ReadablePaymentMethod } from '@app/common/enums';
import { RefundOrderStatus } from '@gateway/enums/status';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { get } from 'lodash';

export class RefundOrderListingDto {
  @ApiProperty({
    description: 'The unique identifier of the order',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'The unique identifier of the transaction',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  @Transform(({ obj }) => get(obj, 'transaction.id'))
  transactionId: string;

  @ApiProperty({
    description: 'The code of the transaction',
    example: 'TX-123',
    type: String,
  })
  @Expose()
  @Transform(({ obj }) => get(obj, 'transaction.transactionCode', null))
  transactionCode: string;

  @ApiProperty({
    description: 'The code of the order',
    example: 'ORD-123',
    type: String,
  })
  @Expose()
  @Type(() => String)
  orderCode: string;

  @ApiProperty({
    description: 'Payment method of the order',
    example: paymentMethodToReadable[ReadablePaymentMethod.VISA],
    enum: ReadablePaymentMethod,
  })
  @Expose()
  @Transform(({ value }) => paymentMethodToReadable[value])
  paymentMethod: ReadablePaymentMethod;

  @ApiProperty({
    description: 'The status of the refund. It can be PENDING, COMPLETED',
    example: RefundOrderStatus.PENDING,
    enum: RefundOrderStatus,
  })
  @Expose()
  refundStatus: RefundOrderStatus;

  @ApiProperty({
    description: 'The refunded time',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  @Transform(({ value }) => value ?? null, { toClassOnly: true })
  refundedAt: Date;

  @ApiProperty({
    description: 'The bank account number',
    example: '89898989899999',
    type: String,
  })
  @Expose()
  @Transform(({ obj }) => get(obj, 'transaction.bankAccountNumber', null))
  bankAccountNumber: string;

  @ApiProperty({
    description: 'The bank name',
    example: 'Techcombank',
    type: String,
  })
  @Expose()
  @Transform(({ obj }) => get(obj, 'transaction.bankName', null))
  bankName: string;

  @ApiProperty({
    description: 'Total price of the order',
    example: 150.75,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  totalPrice: number;

  @ApiProperty({
    description: 'Created time of the order',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  @Transform(({ obj }) => get(obj, 'transaction.createdAt'))
  createdAt: Date;
}
