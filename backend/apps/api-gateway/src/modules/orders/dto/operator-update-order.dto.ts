import { OrderStatus } from '@app/common/types/proto/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class OperatorUpdateOrderDto {
  @ApiPropertyOptional({
    enum: OrderStatus,
    enumName: 'OrderStatus',
    description: 'Status of the order',
    example: OrderStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'The note of the operation',
    example: 'The order is confirmed',
    type: String,
  })
  @IsOptional()
  @IsString()
  operationNote: string;
}
