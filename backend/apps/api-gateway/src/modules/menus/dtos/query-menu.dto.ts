import {
  FilterRuleDto,
  PaginationQueryDto,
  SortRule,
  parseFilter,
  parseSort,
} from '@gateway/gateway-common/dto/query-dto';
import { normalizeArray, transformFilterItem } from '@gateway/modules/menus/utils';
import { Expose, Transform } from 'class-transformer';
import { IsArray } from 'class-validator';

export class OperatorQueryItemDto extends PaginationQueryDto {
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
