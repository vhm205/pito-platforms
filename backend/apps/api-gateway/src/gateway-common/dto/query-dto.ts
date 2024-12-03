import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_NUMBER } from '@app/common';
import { FilterRule } from '@app/common/types/proto/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsEnum, IsArray } from 'class-validator';

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'is' // is null
  | 'in' // in array
  | 'cs' // contains
  | 'cd' // contained
  | 'ov'; // overlap

class Sort<T> {
  @IsString()
  column: keyof T;

  @IsEnum(SortDirection)
  direction: SortDirection;
}

function parseFilter(
  value: string | string[],
): { column: string; operator: string; value: string }[] {
  const arrayValue = Array.isArray(value) ? value : [value];

  return arrayValue.map(v => {
    if (typeof v !== 'string') return v;
    const [column, operator, ...restValues] = v.split(':');
    return { column, operator, value: restValues.join(':') };
  });
}

function parseSort(value: string): { column: string; direction: string }[] {
  const arrayValue = Array.isArray(value) ? value : [value];
  return arrayValue.map(v => {
    if (typeof v !== 'string') return v;
    const [column, direction] = v.split(':');
    return { column, direction };
  });
}

class FilterRuleDto implements FilterRule {
  @ApiProperty({
    type: String,
    example: 'id',
  })
  column: string;

  @ApiProperty({
    type: String,
    example: 'eq',
  })
  operator: FilterOperator;

  @ApiProperty({
    type: String,
    example: '1',
  })
  value: string;
}

export class PaginationQueryDto<T> {
  @ApiPropertyOptional({
    type: Number,
    example: DEFAULT_PAGE_NUMBER,
    description: 'The page number',
  })
  @Transform(({ value }) => Number(value) ?? DEFAULT_PAGE_NUMBER)
  @IsNumber()
  @IsOptional()
  page: number = DEFAULT_PAGE_NUMBER;

  @ApiPropertyOptional({
    type: Number,
    example: DEFAULT_PAGE_LIMIT,
    description: 'The page size',
  })
  @Transform(({ value }) => Number(value) ?? DEFAULT_PAGE_LIMIT)
  @IsNumber()
  @IsOptional()
  pageSize: number = DEFAULT_PAGE_LIMIT;

  @ApiPropertyOptional({
    type: Array<FilterRuleDto>,
    description: 'The filter rules',
  })
  @IsOptional()
  @Transform(({ value }) => parseFilter(value))
  @IsArray()
  filter: FilterRuleDto[];

  @IsOptional()
  @Transform(({ value }) => parseSort(value))
  sort: Sort<T>[];

  constructor(partial: Partial<PaginationQueryDto<T>>) {
    Object.assign(this, partial);
  }
}
