import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_NUMBER } from '@app/common';
import { FilterRule } from '@app/common/types/proto/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsEnum, IsArray } from 'class-validator';

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'is' // checking for (null, not null, true, false)
  | 'in' // in array
  | 'cs' // contains
  | 'cd' // contained
  | 'ov'; // overlap

export function parseFilter(
  value: string | string[],
): { column: string; operator: string; value: string }[] {
  const arrayValue = Array.isArray(value) ? value : [value];

  return arrayValue.map(v => {
    if (typeof v !== 'string') return v;
    const [column, operator, ...restValues] = v.split(':');
    return { column, operator, value: restValues.join(':') };
  });
}

export function parseSort(value: string): { column: string; direction: string }[] {
  const arrayValue = Array.isArray(value) ? value : [value];
  return arrayValue.map(v => {
    if (typeof v !== 'string') return v;
    const [column, direction] = v.split(':');
    return { column, direction };
  });
}

export class SortRule {
  @IsString()
  column: string;

  @IsEnum(SortDirection)
  direction: SortDirection;
}

export class FilterRuleDto implements FilterRule {
  @ApiProperty({
    type: String,
    example: 'id',
  })
  @Type(() => String)
  column: string;

  @ApiProperty({
    type: String,
    example: 'eq',
  })
  @Type(() => String)
  operator: FilterOperator;

  @ApiProperty({
    type: String,
    example: '1',
  })
  @Type(() => String)
  value: string;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({
    type: Number,
    example: DEFAULT_PAGE_NUMBER,
    description: 'The page number',
  })
  @Expose()
  @Transform(({ value }) => Number(value) ?? DEFAULT_PAGE_NUMBER)
  @IsNumber()
  @IsOptional()
  page: number = DEFAULT_PAGE_NUMBER;

  @ApiPropertyOptional({
    type: Number,
    example: DEFAULT_PAGE_LIMIT,
    description: 'The page size',
  })
  @Expose()
  @Transform(({ value }) => Number(value) ?? DEFAULT_PAGE_LIMIT)
  @IsNumber()
  @IsOptional()
  pageSize: number = DEFAULT_PAGE_LIMIT;

  @ApiPropertyOptional({
    description: 'The filter rules with format column:operator:value',
    type: String,
    example: 'id:eq:13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
  })
  @Expose()
  @IsOptional()
  @IsArray()
  filter: string[];

  @ApiPropertyOptional({
    description: 'The sort rule with format column:direction',
    type: String,
    example: 'createdAt:asc',
  })
  @Expose()
  @IsOptional()
  @IsArray()
  sort: string[];
}
