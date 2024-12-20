import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { get } from 'lodash';

import { StoreDto, CustomerDto, OrderDto, LocationDto, OrderNoteDto } from './common.dto';

class StoreContactDto {
  @ApiProperty({
    description: 'The email of the store',
    example: 'john.doe@example.com',
    type: String,
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The phone number of the store',
    example: '84353448767',
    type: String,
  })
  @Expose()
  phone: string;

  @ApiProperty({
    description: 'The full name of the store contact',
    example: 'John Doe',
    type: String,
  })
  @Expose()
  fullName: string;
}

class StoreDetailDto extends StoreDto {
  @ApiProperty({
    description: 'The location of the store',
    type: LocationDto,
  })
  @Expose()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({
    description: 'The contacts of the store',
    type: [StoreContactDto],
  })
  @Expose()
  contacts: StoreContactDto[];
}

class StatusChangeDto {
  @ApiProperty({
    description: 'The previous status of the order',
    example: 'pending',
    type: String,
  })
  @Expose()
  @Type(() => String)
  previousStatus: string;

  @ApiProperty({
    description: 'The new status of the order',
    example: 'accepted',
    type: String,
  })
  @Expose()
  @Type(() => String)
  newStatus: string;

  @ApiProperty({
    description: 'The changed time of the status',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  changedAt: Date;

  @ApiProperty({
    description: 'The name of user who changed the status',
    example: 'John Doe',
    type: String,
  })
  @Expose()
  @Type(() => String)
  changedBy: string;

  @ApiProperty({
    description: 'The reason for the status change',
    example: 'The order is accepted',
    type: String,
  })
  @Expose()
  @Type(() => String)
  reason?: string;
}

export class OrderDetailDto extends OrderDto {
  @Exclude()
  deliveryEta: number;

  @ApiPropertyOptional({
    description: 'Time for the order to be confirmed',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  confirmedAt: Date;

  @ApiPropertyOptional({
    description: 'Time for the order to be prepared',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  preparingAt: Date;

  @ApiPropertyOptional({
    description: 'Time for the order to be prepared',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  preparedAt: Date;

  @ApiPropertyOptional({
    description: 'Time for the order to be delivered',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  deliveryAt: Date;

  @ApiPropertyOptional({
    description: 'Time for the order to be failed to deliver',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  deliveryFailedAt: Date;

  @ApiPropertyOptional({
    description: 'Time for the order to be completed',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  completedAt: Date;

  @ApiPropertyOptional({
    description: 'Time for the order to be canceled',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose({ name: 'cancelledAt' })
  canceledAt: Date;

  @ApiPropertyOptional({
    description: 'The reason for the order to be canceled',
    example: 'The order is canceled',
    type: String,
  })
  @Expose()
  cancelReason: string;

  @ApiProperty({
    description: 'The history of the order status changes',
    type: [StatusChangeDto],
  })
  @Expose()
  @Type(() => StatusChangeDto)
  @Transform(({ obj }) => get(obj, 'metadata.statusHistory', []))
  statusHistory: StatusChangeDto[];

  @ApiProperty({
    description: 'The notes of operations on the order',
    type: [OrderNoteDto],
  })
  @Expose()
  @Type(() => OrderNoteDto)
  @Transform(({ obj }) => get(obj, 'metadata.operationNotes', []))
  operationNotes: OrderNoteDto[];

  @ApiProperty({
    description: 'The store information where the order was placed',
    type: StoreDetailDto,
  })
  @Expose()
  @Transform(({ value }) =>
    plainToInstance(StoreDetailDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  store: StoreDetailDto;

  @ApiProperty({
    description: 'The customer information who placed the order',
    type: CustomerDto,
  })
  @Expose()
  @Transform(({ value }) =>
    plainToInstance(CustomerDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  customer: CustomerDto;

  @ApiProperty({
    description: 'The name of the person who referred the customer',
    example: 'John Doe',
    type: String,
  })
  @Expose()
  @Transform(({ obj }) => get(obj, 'metadata.introducer_name'))
  referralPerson: string;
}
