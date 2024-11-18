import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

import { Order } from '../../constants';

export class PageOptionsDto {
  @ApiPropertyOptional({
    enum: Order,
    default: Order.ASC,
    description: 'Sort order (ASC or DESC)',
  })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'Page number (starting from 1)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    description: 'Number of items per page (max 50)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take: number = 10;

  @ApiPropertyOptional({
    description: 'Search query string',
  })
  @IsString()
  @IsOptional()
  readonly q?: string;

  skip?(): number {
    return (this.page - 1) * this.take;
  }
}
