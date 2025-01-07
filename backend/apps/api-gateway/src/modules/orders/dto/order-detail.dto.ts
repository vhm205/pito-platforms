import { getPublicImageURL } from '@app/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { get } from 'lodash';

import {
  StoreDto,
  CustomerDto,
  OrderDto,
  LocationDto,
  OperatorNoteEntry,
  ChangeLogEntry,
} from './common.dto';

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
    type: [ChangeLogEntry],
  })
  @Expose()
  @Type(() => ChangeLogEntry)
  @Transform(({ obj }) => plainToInstance(ChangeLogEntry, get(obj, 'metadata.changeLogs', [])))
  changeLogs: ChangeLogEntry[];

  @ApiProperty({
    description: 'The notes of operations on the order',
    type: [OperatorNoteEntry],
  })
  @Expose()
  @Type(() => OperatorNoteEntry)
  @Transform(({ obj }) =>
    plainToInstance(OperatorNoteEntry, get(obj, 'metadata.operationNotes', [])),
  )
  operationNotes: OperatorNoteEntry[];

  @ApiProperty({
    description: 'The image URLs of the order',
    type: [String],
  })
  @Expose()
  @Transform(({ obj }) =>
    get(obj, 'metadata.imageUrls', []).map((url: string) =>
      getPublicImageURL('images/orders', url),
    ),
  )
  imageUrls: string[];

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
