import { HandleIpnAcbResponse } from '@app/common/types/proto/payment/acb';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

/**
 * REQUEST DTO
 */
export class HandleIpnAcbRequestDto {
  @ApiProperty({ description: 'The date and time of the request' })
  @IsString()
  @IsNotEmpty()
  requestDateTime: string;

  @ApiProperty({ description: 'Parameters of the request' })
  @IsOptional()
  requestParameters: RequestParameters | undefined;

  @ApiProperty({ description: 'Unique identifier for tracing the request' })
  @IsString()
  @IsNotEmpty()
  requestTrace: string;
}

/**
 * RESPONSE DTO
 */
export class HandleIpnAcbResponseDto implements HandleIpnAcbResponse {
  @ApiProperty({ description: 'Unique identifier for tracing the request' })
  @IsString()
  @IsNotEmpty()
  requestTrace: string;

  @ApiProperty({ description: 'The date and time of the response' })
  @IsString()
  @IsNotEmpty()
  responseDateTime: string;

  @ApiProperty({ description: 'Status of the response' })
  @IsOptional()
  responseStatus: HandleIpnAcbResponseStatus | undefined;

  @ApiProperty({ description: 'Body of the response' })
  @IsOptional()
  responseBody: HandleIpnAcbResponseBody | undefined;
}

export class HandleIpnAcbResponseStatus {
  @ApiProperty({ description: 'Response code' })
  @IsString()
  @IsNotEmpty()
  responseCode: string;

  @ApiProperty({ description: 'Response message' })
  @IsString()
  @IsNotEmpty()
  responseMessage: string;
}

export class HandleIpnAcbResponseBody {
  @ApiProperty({ description: 'Index' })
  @IsNumber()
  @IsNotEmpty()
  index: number;

  @ApiProperty({ description: 'Reference code' })
  @IsString()
  @IsNotEmpty()
  referenceCode: string;
}

export class RequestParameters {
  @ApiProperty({ description: 'Master metadata' })
  @IsOptional()
  masterMeta: RequestParametersMasterMeta | undefined;

  @ApiProperty({ description: 'Request data' })
  @IsOptional()
  request: RequestParametersRequest | undefined;
}

export class RequestParametersRequestMeta {
  @ApiProperty({ description: 'Request code' })
  @IsString()
  @IsNotEmpty()
  requestCode: string;

  @ApiProperty({ description: 'Request type' })
  @IsString()
  @IsNotEmpty()
  requestType: string;
}

export class RequestParametersRequest {
  @ApiProperty({ description: 'Request metadata' })
  @IsOptional()
  requestMeta: RequestParametersRequestMeta | undefined;

  @ApiProperty({ description: 'Request parameters' })
  @IsOptional()
  requestParams: RequestParams | undefined;
}

export class RequestParametersMasterMeta {
  @ApiProperty({ description: 'Client ID' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ description: 'Client request ID' })
  @IsString()
  @IsNotEmpty()
  clientRequestId: string;
}

export class RequestParamsTransaction {
  @ApiProperty({ description: 'Transaction amount' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Debit or credit indicator' })
  @IsString()
  @IsNotEmpty()
  debitOrCredit: string;

  @ApiProperty({ description: 'Effective date of the transaction' })
  @IsString()
  @IsNotEmpty()
  effectiveDate: string;

  @ApiProperty({ description: 'Transaction channel' })
  @IsString()
  @IsNotEmpty()
  transactionChannel: string;

  @ApiProperty({ description: 'Transaction content' })
  @IsString()
  @IsNotEmpty()
  transactionContent: string;

  @ApiProperty({ description: 'Transaction date' })
  @IsString()
  @IsNotEmpty()
  transactionDate: string;

  @ApiProperty({ description: 'Transaction entity attributes' })
  @IsOptional()
  transactionEntityAttribute: TransactionEntityAttribute | undefined;

  @ApiProperty({ description: 'Transaction status' })
  @IsString()
  @IsNotEmpty()
  transactionStatus: string;
}

export class RequestParams {
  @ApiProperty({ description: 'Pagination information' })
  @IsOptional()
  pagination: RequestParamsPagination | undefined;

  @ApiProperty({ description: 'List of transactions', type: [RequestParamsTransaction] })
  @IsArray()
  transactions: RequestParamsTransaction[];
}

export class RequestParamsPagination {
  @ApiProperty({ description: 'Page number' })
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @ApiProperty({ description: 'Page size' })
  @IsNumber()
  @IsNotEmpty()
  pageSize: number;

  @ApiProperty({ description: 'Total number of pages' })
  @IsNumber()
  @IsNotEmpty()
  totalPage: number;
}

export class TransactionEntityAttribute {
  @ApiProperty({ description: 'Beneficiary name' })
  @IsString()
  @IsNotEmpty()
  beneficiaryName: string;

  @ApiProperty({ description: 'Custom field 1' })
  @IsString()
  @IsNotEmpty()
  custom1: string;

  @ApiProperty({ description: 'Custom field 2' })
  @IsString()
  @IsNotEmpty()
  custom2: string;

  @ApiProperty({ description: 'Custom field 3' })
  @IsString()
  @IsNotEmpty()
  custom3: string;

  @ApiProperty({ description: 'Custom field 4' })
  @IsString()
  @IsNotEmpty()
  custom4: string;

  @ApiProperty({ description: 'Trace number' })
  @IsString()
  @IsNotEmpty()
  traceNumber: string;

  @ApiProperty({ description: 'Virtual account number' })
  @IsString()
  @IsNotEmpty()
  virtualAccount: string;
}
