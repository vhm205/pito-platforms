import { CreateAcbQrPaymentResponse } from '@app/common/types/proto/payment/acb';
import { ApiProperty } from '@nestjs/swagger';
import { IsPositive, IsString } from 'class-validator';

/**
 * REQUEST DTO
 */
export class CreateAcbQrPaymentRequestDto {
  @ApiProperty()
  @IsString()
  txId: string;

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
  userId: string;
}

/**
 * RESPONSE DTO
 */
export class CreateAcbQrPaymentResponseDto implements CreateAcbQrPaymentResponse {
  @ApiProperty()
  qrCode: string;
}
