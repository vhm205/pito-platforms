import { HandleIpnVnpayRequest } from '@app/common/types/proto/payment/vnpay';
import { ClientIP } from '@gateway/decorators';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  CreateAcbQrPaymentRequestDto,
  CreateAcbQrPaymentResponseDto,
} from './dtos/create-acb-qr-payment.dto';
import {
  CreateVnpayUrlPaymentRequestDto,
  CreateVnpayUrlPaymentResponseDto,
} from './dtos/create-vnpay-url-payment.dto';
import { HandleIpnAcbRequestDto } from './dtos/handle-acb-ipn.dto';
import { HandleIpnVnpayRequestDto } from './dtos/handle-vnpay-ipn.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('vnpay/url')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: CreateVnpayUrlPaymentResponseDto })
  createVnpayUrlPayment(@Body() body: CreateVnpayUrlPaymentRequestDto, @ClientIP() ip: string) {
    return this.paymentService.createVnpayUrlPayment({
      ...body,
      ipAddr: ip,
    });
  }

  @Post('vnpay/ipn')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  handleVnpayIpn(@Body() body: HandleIpnVnpayRequestDto) {
    const payload: HandleIpnVnpayRequest = {
      vnpAmount: body.vnp_Amount,
      vnpBankCode: body.vnp_BankCode,
      vnpBankTranNo: body.vnp_BankTranNo,
      vnpCardType: body.vnp_CardType,
      vnpOrderInfo: body.vnp_OrderInfo,
      vnpPayDate: body.vnp_PayDate,
      vnpResponseCode: body.vnp_ResponseCode,
      vnpTmnCode: body.vnp_TmnCode,
      vnpTransactionNo: body.vnp_TransactionNo,
      vnpTxnRef: body.vnp_TxnRef,
      vnpSecureHash: body.vnp_SecureHash,
      vnpTransactionStatus: body.vnp_TransactionStatus,
    };
    return this.paymentService.handleVnpayIpn(payload);
  }

  @Post('acb/qr')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: CreateAcbQrPaymentResponseDto })
  createAcbQrPayment(@Body() body: CreateAcbQrPaymentRequestDto) {
    return this.paymentService.createAcbQrPayment(body);
  }

  @Post('acb/ipn')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  handleAcbIpn(@Body() body: HandleIpnAcbRequestDto) {
    return this.paymentService.handleAcbIpn(body);
  }
}
