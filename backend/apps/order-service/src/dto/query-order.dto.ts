import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_NUMBER } from '@app/common';
import { Order } from '../domain';

export class FilterOrderDto {
  @ApiProperty()
  @IsString()
  orderCode?: string;
}

export class SortOrderDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  column: keyof Order;

  @ApiProperty()
  @IsString()
  direction: 'ASC' | 'DESC';
}

export class QueryOrderDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : DEFAULT_PAGE_NUMBER))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : DEFAULT_PAGE_LIMIT))
  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterOrderDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterOrderDto)
  filters?: FilterOrderDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortOrderDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortOrderDto)
  sorts?: SortOrderDto[] | null;
}
