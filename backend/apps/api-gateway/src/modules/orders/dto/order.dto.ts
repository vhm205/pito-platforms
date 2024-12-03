import { orderStatusToReadable, orderTypeToReadable, paymentMethodToReadable } from '@app/common';
import { ReadablePaymentMethod, ReadableOrderStatus, ReadableOrderType } from '@app/common/enums';
import { IMAGE_BASE_URLS } from '@gateway/constants';
import { generatePublicImageUrl } from '@gateway/utils/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { CustomerDto } from './customer.dto';
import { StoreDto } from './store.dto';

class ItemDto {
  @ApiProperty({
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
    description: 'The unique identifier of the item',
  })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Pizza Margherita', type: String, description: 'The name of the item' })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'pizza-margherita',
    type: String,
    description: 'The slug of the item',
  })
  @Expose()
  slug: string;

  @ApiPropertyOptional({
    example: ['https://image-url.com'],
    type: Array<string>,
    description: 'The images of the item',
  })
  @Expose()
  @Transform(({ value }) =>
    value?.map((path: string) => generatePublicImageUrl(path, IMAGE_BASE_URLS.item)),
  )
  images?: string[];

  @ApiProperty({ example: 3456000, type: Number, description: 'The base price of the item' })
  @Expose()
  basePrice: number;
}

class SelectedChoiceDto {
  @ApiProperty({ example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d', type: String })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Extra cheese', type: String })
  @Expose()
  name: string;

  @ApiProperty({ example: 10000, type: Number })
  @Expose()
  price: number;

  @ApiProperty({ example: 2, type: Number })
  @Expose()
  quantity: number;
}
class SelectedOptionDto {
  @ApiProperty({ example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d', type: String })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Extra cheese', type: String })
  @Expose()
  name: string;

  @ApiProperty({
    type: Array<SelectedChoiceDto>,
  })
  @Expose()
  selectedChoices: SelectedChoiceDto[];
}

class OrderItemDto {
  @ApiProperty({ example: 3456000, type: Number, description: 'The base price of the item' })
  @Expose()
  totalPrice: number;

  @ApiProperty({ example: 2, type: Number, description: 'The quantity of the item' })
  @Expose()
  quantity: number;

  @ApiPropertyOptional({
    example: 'Extra cheese, no onions',
    description: 'The notes for the item',
    type: String,
  })
  @Expose()
  notes?: string;

  @ApiProperty({
    type: ItemDto,
    description: 'The item included in the order',
  })
  @Expose()
  @Transform(({ value }) => plainToInstance(ItemDto, value, { excludeExtraneousValues: true }))
  item: ItemDto;

  @ApiProperty({
    type: Array<SelectedOptionDto>,
    description: 'The selected options for the item',
  })
  @Expose()
  @Transform(({ value }) =>
    plainToInstance(SelectedOptionDto, value, { excludeExtraneousValues: true }),
  )
  selectedOptions: SelectedOptionDto[];
}

class VATInfoDto {
  @ApiProperty({ example: 'PITO VN', description: 'The name of the company' })
  @Expose({ name: 'name' })
  companyName: string;

  @ApiProperty({ example: 'quang.tran@pito.vn', description: 'The tax code of the company' })
  @Expose({ name: 'email' })
  companyEmail: string;

  @ApiProperty({
    example: '123 Main St, New York, NY 10001',
    description: 'The address of the company',
  })
  @Expose({ name: 'address' })
  companyAddress: string;

  @ApiProperty({ example: '123456789', description: 'The phone number of the company' })
  @Expose({ name: 'tax_code' })
  taxCode: string;
}

export class OrderDto {
  @ApiProperty({ example: '12345', description: 'The unique identifier of the order' })
  @Expose()
  id: string;

  @ApiProperty({
    type: StoreDto,
    description: 'The store where the order was placed',
  })
  @Expose()
  @Transform(({ value }) => plainToInstance(StoreDto, value, { excludeExtraneousValues: true }))
  store: StoreDto;

  @ApiProperty({
    type: CustomerDto,
    description: 'The customer who placed the order',
  })
  @Expose()
  customer: CustomerDto;

  @ApiProperty({
    example: ReadableOrderType.PX,
    description: 'The type of the order',
    enum: ReadableOrderType,
  })
  @Expose()
  @Transform(({ value }) => orderTypeToReadable[value])
  orderType: ReadableOrderType;

  @ApiProperty({ example: 'ORD123456', description: 'The code of the order' })
  @Expose()
  orderCode: string;

  @ApiProperty({ example: 150.75, description: 'The total price of the order' })
  @Expose()
  totalPrice: number;

  @ApiProperty({ example: 100.5, description: 'The subtotal price of the order' })
  @Expose()
  subTotalPrice: number;

  @ApiProperty({ example: 10.25, description: 'The shipping fee of the order' })
  @Expose()
  shippingFee: number;

  @ApiProperty({ example: 5, description: 'The discount amount of the order' })
  @Expose()
  discountAmount: number;

  @ApiProperty({ example: 0, description: 'The discount shipping fee of the order' })
  @Expose()
  discountShippingFee: number;

  @ApiProperty({
    example: ReadablePaymentMethod.QR_CODE,
    description: 'The payment method used for the order',
    enum: ReadablePaymentMethod,
  })
  @Expose()
  @Transform(({ value }) => paymentMethodToReadable[value])
  paymentMethod: ReadablePaymentMethod;

  @ApiProperty({
    example: ReadableOrderStatus.DRAFT,
    description: 'The status of the order',
    enum: ReadableOrderStatus,
  })
  @Expose()
  @Transform(({ value }) => orderStatusToReadable[value])
  status: ReadableOrderStatus;

  @ApiPropertyOptional({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the order will be delivered',
  })
  @Expose()
  deliveryAt?: Date;

  @ApiPropertyOptional({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the order delivery failed',
  })
  @Expose()
  deliveryFailedAt?: Date;

  @ApiPropertyOptional({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the order was completed',
  })
  @Expose()
  completedAt?: Date;

  // @ApiPropertyOptional({
  //   example: '2023-10-01T12:00:00Z',
  //   description: 'The date and time when the order was cancelled',
  // })
  // cancelledAt?: Date;

  @ApiPropertyOptional({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the order was prepared',
  })
  @Expose()
  preparedAt?: Date;

  @ApiPropertyOptional({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the order was confirmed',
  })
  @Expose()
  confirmedAt?: Date;

  @ApiProperty({
    example: '123 Main St, New York, NY 10001',
    description: 'The delivery address of the order',
  })
  @Expose()
  deliveryAddress: string;

  @ApiProperty({ example: 60, description: 'The estimated time of arrival for the order' })
  @Expose()
  deliveryEta: number;

  @ApiPropertyOptional({
    example: 'https://tracking-url.com',
    description: 'The tracking URL of the order',
  })
  @Expose()
  trackingUrl?: string;

  @ApiPropertyOptional({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the order was delivered',
  })
  @Expose()
  deliveryDate?: Date;

  @ApiPropertyOptional({
    example: 'The order was cancelled due to an invalid address',
    description: 'The reason for the cancellation of the order',
  })
  @Expose()
  cancelReason?: string;

  // @ApiProperty({ example: false, description: 'Whether the order will be delivered later' })
  // @Expose()
  // deliveryLater: boolean;

  @ApiPropertyOptional({
    example: 'Please deliver between 9 AM to 5 PM',
    description: 'The note for the order',
  })
  @Expose()
  note?: string;

  @ApiProperty({
    type: Array<OrderItemDto>,
    description: 'The items included in the order',
    example: [
      {
        price: 3456000,
        totalPrice: 3456000,
        quantity: 3,
        item: {
          id: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
          name: 'Set Creamcheese Heaven 9 Brownies',
          slug: 'set-creamcheese-heaven-9-brownies',
          images: ['https://image-url.com'],
        },
        selectedOptions: [
          {
            id: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
            name: 'Extra cheese',
            selectedChoices: [
              {
                id: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
                name: 'Extra cheese',
                price: 10000,
                quantity: 2,
              },
            ],
          },
        ],
      },
    ],
  })
  @Expose()
  @Transform(({ value }) => plainToInstance(OrderItemDto, value, { excludeExtraneousValues: true }))
  orderItems: OrderItemDto[];

  @ApiPropertyOptional({
    type: VATInfoDto,
    description: 'The VAT information for the order',
    example: {
      companyName: 'PITO VN',
      companyEmail: 'pito@.vn',
      companyAddress: '123 Main St, New York, NY 10001',
      taxCode: '123456789',
    },
  })
  @Expose()
  @Transform(({ value }) =>
    plainToInstance(VATInfoDto, value, {
      excludeExtraneousValues: true,
    }),
  )
  vatInfo?: VATInfoDto;

  // @ApiPropertyOptional({
  //   example: '1',
  //   description: 'The count of the order',
  // })
  // @Expose()
  // orderCount: string;

  // @ApiProperty({ example: 0, description: 'The error code of the order' })
  // @Expose()
  // errorCode: number;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the order was created',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-02T12:00:00Z',
    description: 'The date and time when the order was last updated',
  })
  @Expose()
  updatedAt: Date;
}
