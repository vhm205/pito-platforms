import { AppVersion } from '@app/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

class VatInfo {
  @ApiProperty({
    description: 'Name of the company',
    example: 'Company Name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Tax code of the company',
    example: '1234567890',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  taxCode: string;

  @ApiProperty({
    description: 'Email address of the company',
    example: 'company@example.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Address of the company',
    example: 'Company Address',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Whether this is the default VAT info',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  isDefault: boolean;
}

class AddressDetail {
  @ApiProperty({
    description: 'Name of the building',
    example: 'Building Name',
    type: String,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Building number',
    example: '123',
    type: String,
  })
  @IsString()
  @IsOptional()
  building: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Company Name',
    type: String,
  })
  @IsString()
  @IsOptional()
  companyName: string;

  @ApiProperty({
    description: 'Number of the apartment',
    example: 'A101',
    type: String,
  })
  @IsString()
  @IsOptional()
  numberOfApartment: string;

  @ApiProperty({
    description: 'Latitude of the address',
    example: 10.123456,
    type: String,
  })
  @IsLatitude()
  latitude: string;

  @ApiProperty({
    description: 'Longitude of the address',
    example: 10.123456,
    type: String,
  })
  @IsLongitude()
  longitude: string;
}

/**
 * REQUEST DTO
 */
export class CreateOrderDto {
  @ApiProperty({
    description: 'Session ID of the user',
    example: 'session-123',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({
    description: 'Array of voucher IDs',
    example: ['voucher-1', 'voucher-2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  voucherIds: string[];

  @ApiProperty({
    description: 'Order note',
    example: 'Please deliver on time',
    type: String,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Receiver name',
    example: 'John Doe',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  receiverName: string;

  @ApiProperty({
    description: 'Receiver phone number',
    example: '1234567890',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  receiverPhone: string;

  @ApiProperty({
    description: 'Delivery address',
    example: '123 Main Street',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiProperty({
    description: 'Delivery date',
    example: '2024-12-20',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  deliveryDate: string;

  @ApiProperty({
    description: 'Whether delivery is later',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  deliveryLater: boolean;

  @ApiProperty({
    description: 'Payment method',
    example: 'COD',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    description: 'Order type',
    example: 'delivery',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  orderType: string;

  @ApiProperty({
    description: 'VNPay callback URL',
    example: 'https://your-domain.com/vnpay/callback',
    type: String,
  })
  @IsString()
  @IsOptional()
  vnpayCallbackUrl: string;

  @ApiProperty({
    description: 'Bank code for payment',
    example: 'VCB',
    type: String,
  })
  @IsString()
  @IsOptional()
  bankCode: string;

  @ApiProperty({
    description: 'VAT information',
    type: VatInfo,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => VatInfo)
  vatInfo: VatInfo;

  @ApiProperty({
    description: 'Address details',
    type: AddressDetail,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDetail)
  addressDetail: AddressDetail;

  @ApiProperty({
    description: 'Receiver email address',
    example: 'john.doe@example.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  receiverEmail: string;

  @ApiProperty({
    description: 'Introducer name',
    example: 'Jane Doe',
    type: String,
  })
  @IsString()
  @IsOptional()
  introducerName: string;

  @ApiProperty({
    type: Number,
    enum: AppVersion,
    example: AppVersion.V1,
    description: 'App version',
  })
  version: number;
}

/**
 * RESPONSE DTO
 */
class PaymentData {
  @ApiProperty({
    description: 'QR code for payment',
    example: 'data:image/png;base64,...',
    type: String,
    required: false,
    nullable: true,
  })
  qrCode?: string;

  @ApiProperty({
    description: 'Payment URL',
    example: 'https://payment.gateway.com/pay',
    type: String,
    required: false,
    nullable: true,
  })
  url?: string;

  @ApiProperty({
    description: 'Payment state',
    example: 'PENDING',
    type: String,
  })
  state: string;
}

export class CreateOrderResponseDto {
  @ApiProperty({
    description: 'Order code',
    example: 'ORD-12345',
    type: String,
  })
  orderCode: string;

  @ApiProperty({
    description: 'Order ID',
    example: '61b21373-13ee-4594-b90b-c13872b5cdcd',
    type: String,
  })
  orderId: string;

  @ApiProperty({
    description: 'Total price of the order',
    example: 100000,
    type: Number,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'Transaction code',
    example: 'TXN-12345',
    type: String,
  })
  txCode: string;

  @ApiProperty({
    description: 'Transaction ID',
    example: 'TXN-ID-12345',
    type: String,
  })
  txId: string;

  @ApiProperty({
    description: 'Payment data',
    type: PaymentData,
    required: false,
    nullable: true,
  })
  paymentData?: PaymentData;
}
