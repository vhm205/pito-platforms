import { CreateVnpayUrlPaymentResponse } from '@app/common/types/proto/payment/vnpay';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPositive, IsOptional } from 'class-validator';

/**
 * REQUEST DTO
 */
export class CreateVnpayUrlPaymentRequestDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  orderCode: string;

  @ApiProperty()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsString()
  bankCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  locale: string;

  @ApiProperty()
  @IsString()
  callbackUrl: string;
}

/**
 * RESPONSE DTO
 */
export class CreateVnpayUrlPaymentResponseDto implements CreateVnpayUrlPaymentResponse {
  @ApiProperty({ type: String })
  paymentUrl: string;
}
