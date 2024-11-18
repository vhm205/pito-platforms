import { Order, OrderItem } from '@app/common';
import { OrderStatus } from '@app/common/enums';
import { PaymentMethod } from '@app/common/enums/payment';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto implements Order {
  @ApiProperty({ example: '12345', description: 'The unique identifier of the order' })
  orderId: string;

  @ApiProperty({ example: 'Store Name', description: 'The name of the store' })
  storeName: string;

  @ApiProperty({ example: 'Introduction text', description: 'Introduction of the order' })
  introduction: string;

  @ApiProperty({ example: 'order-slug', description: 'The slug of the order' })
  slug: string;

  @ApiProperty({ example: 'thumbnail.jpg', description: 'The thumbnail image of the order' })
  thumbnail: string;

  @ApiProperty({ example: 'avatar.jpg', description: 'The avatar image of the order' })
  avatar: string;

  @ApiProperty({ example: 'ORD123456', description: 'The code of the order' })
  orderCode: string;

  @ApiProperty({ example: 150.75, description: 'The total price of the order' })
  totalPrice: number;

  @ApiProperty({
    example: 'Please deliver between 9 AM to 5 PM',
    description: 'The note for the order',
  })
  note: string;

  @ApiProperty({ example: 'Jane Doe', description: 'The name of the receiver' })
  receiverName: string;

  @ApiProperty({ example: 0, description: 'The error code of the order' })
  errorCode: number;

  @ApiProperty({
    example: PaymentMethod.qrcode,
    description: 'The payment method used for the order',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: '2023-10-05T12:00:00Z', description: 'The delivery date of the order' })
  deliveryDate: Date | undefined;

  @ApiProperty({ type: Array, description: 'The items included in the order' })
  orderItems: OrderItem[];

  @ApiProperty({ example: '12345', description: 'The unique identifier of the order' })
  id: string;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the order was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-02T12:00:00Z',
    description: 'The date and time when the order was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the customer who placed the order',
    required: false,
  })
  customerName: string;

  @ApiProperty({ example: 100.5, description: 'The total amount of the order' })
  totalAmount: number;

  @ApiProperty({
    example: OrderStatus.completed,
    description: 'The current status of the order',
    enum: OrderStatus,
  })
  status: OrderStatus;
}
