import { InfinityPaginationResponseDto, PagePaginationResponseDto } from '../dto/pagination.dto';
import { PaginationOptions } from '../types/common';

export const infinityPagination = <T>(
  data: T[],
  options: PaginationOptions,
): InfinityPaginationResponseDto<T> => {
  return {
    data,
    hasMore: data.length === options.pageSize,
  };
};

export const pagePagination = <T>(
  data: T[],
  options: PaginationOptions & {
    total: number;
  },
): PagePaginationResponseDto<T> => {
  const { total, page, pageSize } = options;
  return {
    data,
    metadata: {
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
      hasNext: page * pageSize < total,
      hasPrev: page > 1,
    },
  };
};
