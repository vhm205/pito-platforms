import { pagePagination } from '@app/common';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { PaginationOptions } from '@app/common/types/common';
import { FilterOrderDto, SortOrderDto } from './dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  findOrders() {
    return Promise.resolve([[], 0]);
  }

  async findOrdersWithPagination(options: {
    paginationOptions: PaginationOptions;
    sorts: SortOrderDto[];
    filters?: FilterOrderDto;
  }) {
    const [orders, count] = await this.orderRepository.findOrdersWithPagination({
      paginationOptions: options.paginationOptions,
      sorts: options.sorts,
      filters: options.filters,
    });

    return pagePagination(orders, {
      total: count,
      page: options.paginationOptions.page,
      pageSize: options.paginationOptions.pageSize,
    });
  }
}
