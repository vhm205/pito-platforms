import { Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type as TType } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty()
  @IsNumber()
  @TType(() => Number)
  pageSize: number;

  @ApiProperty()
  @IsNumber()
  @TType(() => Number)
  page: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortBy: string;

  @ApiPropertyOptional()
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
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
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
      totalCount: number;
      totalPages: number;
      currentPage: number;
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
