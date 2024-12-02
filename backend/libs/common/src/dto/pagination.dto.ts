import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type as TType } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @TType(() => Number)
  pageSize: number;

  @IsNumber()
  @TType(() => Number)
  page: number;

  @IsString()
  @IsOptional()
  sortBy: string;

  @IsString()
  @IsOptional()
  sortDirection: string;
}

export class InfinityPaginationResponseDto<T> {
  data: T[];
  hasMore: boolean;
}

export class PagePaginationResponseDto<T> {
  data: T[];
  metadata: {
    total: number;
    totalPage: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function InfinityPaginationResponse<T>(classRef: Type<T>) {
  abstract class Pagination {
    @ApiProperty({ type: [classRef] })
    data: T[];

    @ApiProperty()
    hasMore: boolean;
  }

  Object.defineProperty(Pagination, 'name', {
    writable: false,
    value: `InfinityPagination${classRef.name}ResponseDto`,
  });

  return Pagination;
}

export function PagePaginationResponse<T>(classRef: Type<T>) {
  abstract class Pagination {
    @ApiProperty({ type: [classRef] })
    data: T[];

    @ApiProperty()
    metadata: {
      total: number;
      page: number;
      pageSize: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }

  Object.defineProperty(Pagination, 'name', {
    writable: false,
    value: `PagePagination${classRef.name}ResponseDto`,
  });

  return Pagination;
}
