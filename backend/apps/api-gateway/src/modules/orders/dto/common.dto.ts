import { orderTypeToReadable, paymentMethodToReadable } from '@app/common';
import { ReadableOrderType, ReadablePaymentMethod } from '@app/common/enums';
import { OrderStatus } from '@app/common/types/proto/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { get, map } from 'lodash';

import { transformOrderItem } from '../utils/transformer';

export class LocationDto {
  @ApiProperty({
    description: 'Region of the location',
    example: 'Ho Chi Minh',
    type: String,
  })
  @Expose()
  @Type(() => String)
  region: string;

  @ApiProperty({
    description: 'Ward of the location',
    example: 'Ward 10',
    type: String,
  })
  @Expose()
  @Type(() => String)
  ward: string;

  @ApiProperty({
    description: 'Address of the location',
    example: '339/10 Le Van Sy',
    type: String,
  })
  @Expose()
  @Type(() => String)
  address: string;

  @ApiProperty({
    description: 'District of the location',
    example: 'District 3',
    type: String,
  })
  @Expose()
  @Type(() => String)
  district: string;

  @ApiProperty({
    description: 'Latitude of the location',
    example: 21.028511,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the location',
    example: 105.801944,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  longitude: number;
}

export class SelectedChoiceDto {
  @ApiProperty({
    description: 'The unique identifier for the selected choice',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the selected choice',
    example: 'Extra cheese',
    type: String,
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The price of the selected choice',
    example: 10000,
    type: Number,
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: 'The quantity of the selected choice',
    example: 2,
    type: Number,
  })
  @Expose()
  quantity: number;
}

class SelectedOptionDto {
  @ApiProperty({
    description: 'The unique identifier for the selected option',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the selected option',
    example: 'Size',
    type: String,
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The selected choices for the selected option',
    type: [SelectedChoiceDto],
  })
  @Expose()
  selectedChoices: SelectedChoiceDto[];
}

export class StoreDto {
  @ApiProperty({
    description: 'The unique identifier of the store',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the store',
    example: 'John Doe Store',
    type: String,
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The slug of the store',
    example: 'john-doe-store',
    type: String,
  })
  @Expose()
  slug: string;
}

export class CustomerDto {
  @ApiProperty({
    description: 'The unique identifier of the customer',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the customer',
    example: 'John Doe',
    type: String,
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '84353448767',
    type: String,
  })
  @Expose()
  phone: string;

  @ApiProperty({
    description: 'The email of the customer',
    example: 'john.doe@example.com',
    type: String,
  })
  @Expose()
  email: string;
}

export class OrderItemDto {
  @ApiProperty({
    description: 'The unique identifier of the order item',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The slug of the order item',
    example: 'pizza-margherita',
    type: String,
  })
  @Expose()
  slug: string;

  @ApiPropertyOptional({
    description: 'The name of the order item',
    example: 'Pizza Margherita',
    type: String,
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The base price of the order item',
    example: 3456000,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  basePrice: number;

  @ApiProperty({
    description: 'The total price of the order item (base price * quantity)',
    example: 150.75,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  totalPrice: number;

  @ApiProperty({
    description: 'The quantity of the order item',
    example: 3,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'The selected options of the order item',
    type: [SelectedOptionDto],
  })
  @Expose()
  selectedOptions: SelectedOptionDto[];

  @ApiPropertyOptional({
    description: 'The note of the order item',
    example: 'Extra cheese, no onions',
    type: String,
  })
  @Expose()
  @Type(() => String)
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'The images of the order item',
    type: [String],
  })
  @Expose()
  @IsOptional()
  images?: string[];
}

export class OrderDto {
  @ApiProperty({
    description: 'The unique identifier of the order',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'The code of the order',
    example: 'ORD-123',
    type: String,
  })
  @Expose()
  @Type(() => String)
  orderCode: string;

  @ApiProperty({
    description: 'Type of the order',
    example: orderTypeToReadable[ReadableOrderType.PX],
    enum: ReadableOrderType,
  })
  @Expose()
  @Type(() => String)
  @Transform(({ value }) => orderTypeToReadable[value])
  orderType: ReadableOrderType;

  @ApiProperty({
    description: 'Status of the order',
    example: OrderStatus.COMPLETED,
    enum: OrderStatus,
  })
  @Expose()
  status: OrderStatus;

  @ApiProperty({
    description: 'Payment method of the order',
    example: paymentMethodToReadable[ReadablePaymentMethod.VISA],
    enum: ReadablePaymentMethod,
  })
  @Expose()
  @Transform(({ value }) => paymentMethodToReadable[value])
  paymentMethod: ReadablePaymentMethod;

  @ApiProperty({
    description: 'Note of the order',
    example: 'This is a note',
    type: String,
  })
  @Expose()
  @Type(() => String)
  @IsOptional()
  note?: string;

  // Cost-related information
  @ApiProperty({
    description: 'Total price of the order',
    example: 150.75,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  totalPrice: number;

  @ApiProperty({
    description: 'Subtotal price of the order',
    example: 100.5,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  subTotalPrice: number;

  @ApiProperty({
    description: 'Shipping fee of the order',
    example: 10.25,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  shippingFee: number;

  @ApiProperty({
    description: 'Discount amount of the order',
    example: 5,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  discountAmount: number;

  @ApiProperty({
    description: 'Discount shipping fee of the order',
    example: 0,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  discountShippingFee: number;

  // Shipping-related information
  @ApiProperty({
    description: 'Delivery address of the order',
    example: '339/10 Le Van Sy, Ward 10, District 3, Ho Chi Minh',
    type: String,
  })
  @Expose()
  @Type(() => String)
  deliveryAddress: string;

  @ApiProperty({
    description: 'Estimated time of arrival for the order in seconds',
    example: 30,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  deliveryEta: number;

  @ApiProperty({
    description: 'Delivery date of the order',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  deliveryDate: Date;

  // Time-related information
  @ApiProperty({
    description: 'Created time of the order',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Updated time of the order',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Cancelled time of the order',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  @IsOptional()
  cancelledAt?: Date;

  // Order items details
  @ApiProperty({
    description: 'List of order items',
    type: [OrderItemDto],
  })
  @Expose()
  @Transform(({ value }) => plainToInstance(OrderItemDto, map(value, transformOrderItem)))
  orderItems: OrderItemDto[];
}

export class OperatorNoteEntry {
  @ApiProperty({
    description: 'The note of the operation',
    example: 'The order is accepted',
    type: String,
  })
  @Expose()
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'The time the note was created',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  timestamp: string;

  @ApiProperty({
    description: 'The name of the user who created the note',
    example: 'John Doe',
    type: String,
  })
  @Expose()
  @Type(() => String)
  user: string;
}

export enum ChangeLogType {
  STATUS_UPDATE = 'STATUS_UPDATE',
  REFUND_STATUS_UPDATE = 'REFUND_STATUS_UPDATE',
}

export class ChangeLogEntry {
  @ApiProperty({
    description: 'The name of the user who made the change',
    example: 'John Doe',
    type: String,
  })
  user: string;

  @ApiProperty({
    description: 'The type of change',
    example: ChangeLogType.STATUS_UPDATE,
    enum: ChangeLogType,
  })
  changeType: ChangeLogType;

  @ApiPropertyOptional({
    description: 'The old value of the change',
    example: 'CONFIRMED',
    type: String,
  })
  @Transform(({ value, obj }) =>
    get(obj, 'changeType') === ChangeLogType.STATUS_UPDATE ? Number(value) : value,
  )
  oldValue?: string;

  @ApiPropertyOptional({
    description: 'The new value of the change',
    example: 'COMPLETED',
    type: String,
  })
  @Transform(({ value, obj }) =>
    get(obj, 'changeType') === ChangeLogType.STATUS_UPDATE ? Number(value) : value,
  )
  newValue?: string;

  @ApiPropertyOptional({
    description: 'The description of the change',
    example: 'The order is completed',
    type: String,
  })
  description?: string;

  @ApiProperty({
    description: 'The time the change was made',
    example: '2021-09-01T00:00:00.000Z',
    type: String,
  })
  timestamp: string;
}
