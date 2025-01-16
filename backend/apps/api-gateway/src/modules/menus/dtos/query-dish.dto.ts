import {
  FilterRuleDto,
  normalizeArray,
  PaginationQueryDto,
  parseFilter,
  parseSort,
  SortRule,
} from '@gateway/gateway-common/dto/query-dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsArray } from 'class-validator';

import { transformFilterItem } from '../utils';

export class DishDto {
  @ApiProperty({ example: '1', description: 'The unique identifier of the dish' })
  id: string;

  @ApiProperty({ example: 'Pasta', description: 'The name of the dish' })
  name: string;

  @ApiProperty({ example: 10, description: 'The quantity of the dish' })
  quantity: number;

  @ApiProperty({ example: 'kg', description: 'The unit of the quantity' })
  quantityUnit: string;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], description: 'The images of the dish' })
  images: string[];

  @ApiProperty({ example: 'storeId123', description: 'The ID of the store' })
  storeId: string;

  @ApiProperty({ example: 'partnerId123', description: 'The ID of the partner' })
  partnerId: string;

  @ApiProperty({ example: 1, description: 'The ID of the package option' })
  packageOptionId: number;
}

export class FindDishesQueryDto extends PaginationQueryDto {
  @Expose({ name: 'filter' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseFilter(value).map(transformFilterItem))
  filters: FilterRuleDto[];

  @Expose({ name: 'sort' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseSort(value))
  sorts: SortRule[];
}

export class FindDishesResponseDto extends DishDto {}
