import { HandleIpnVnpayResponse } from '@app/common/types/proto/payment/vnpay';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * REQUEST DTO
 */
export class HandleIpnVnpayRequestDto {
  @ApiProperty({ description: 'The amount of the transaction' })
  @IsString()
  @IsNotEmpty()
  vnp_Amount: string;

  @ApiProperty({ description: 'The bank code of the transaction' })
  @IsString()
  @IsNotEmpty()
  vnp_BankCode: string;

  @ApiProperty({ description: 'The bank transaction number' })
  @IsString()
  @IsOptional()
  vnp_BankTranNo: string;

  @ApiProperty({ description: 'The card type used for the transaction' })
  @IsString()
  @IsNotEmpty()
  vnp_CardType: string;

  @ApiProperty({ description: 'Information about the order' })
  @IsString()
  @IsNotEmpty()
  vnp_OrderInfo: string;

  @ApiProperty({ description: 'The date and time of the payment' })
  @IsString()
  @IsNotEmpty()
  vnp_PayDate: string;

  @ApiProperty({ description: 'The response code from VNPay' })
  @IsString()
  @IsNotEmpty()
  vnp_ResponseCode: string;

  @ApiProperty({ description: 'The terminal code (merchant code)' })
  @IsString()
  @IsNotEmpty()
  vnp_TmnCode: string;

  @ApiProperty({ description: 'The transaction number from VNPay' })
  @IsString()
  @IsNotEmpty()
  vnp_TransactionNo: string;

  @ApiProperty({ description: 'The transaction reference number' })
  @IsString()
  @IsNotEmpty()
  vnp_TxnRef: string;

  @ApiProperty({ description: 'The secure hash of the transaction data' })
  @IsString()
  @IsNotEmpty()
  vnp_SecureHash: string;

  @ApiProperty({ description: 'The status of the transaction' })
  @IsString()
  @IsNotEmpty()
  vnp_TransactionStatus: string;
}

/**
 * RESPONSE DTO
 */
export class HandleIpnVnpayResponseDto implements HandleIpnVnpayResponse {
  @ApiProperty()
  RspCode: string;

  @ApiProperty()
  Message: string;
}
