import {
  FilterRuleDto,
  PaginationQueryDto,
  parseFilter,
  parseSort,
  SortRule,
  normalizeArray,
} from '@gateway/gateway-common/dto/query-dto';
import { Expose, Transform } from 'class-transformer';
import { IsArray } from 'class-validator';

import {
  transformFilterOrder,
  transformRefundOrderFilter,
  transformStoreOrderFilter,
} from '../utils/transformer';

export class OperatorQueryOrderDto extends PaginationQueryDto {
  @Expose({ name: 'filter' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseFilter(value).map(transformFilterOrder))
  filters: FilterRuleDto[];

  @Expose({ name: 'sort' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseSort(value))
  sorts: SortRule[];
}

export class UserQueryOrderHistoryDto extends PaginationQueryDto {
  @Expose({ name: 'filter' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseFilter(value).map(transformFilterOrder))
  filters: FilterRuleDto[];

  @Expose({ name: 'sort' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseSort(value))
  sorts: SortRule[];
}

export class OperatorQueryStoreOrderDto extends PaginationQueryDto {
  @Expose({ name: 'filter' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseFilter(value).map(transformStoreOrderFilter))
  filters: FilterRuleDto[];

  @Expose({ name: 'sort' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseSort(value))
  sorts: SortRule[];
}

export class RefundOrderQueryDto extends PaginationQueryDto {
  @Expose({ name: 'filter' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseFilter(value).map(transformRefundOrderFilter))
  filters: FilterRuleDto[];

  @Expose({ name: 'sort' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseSort(value))
  sorts: SortRule[];
}
