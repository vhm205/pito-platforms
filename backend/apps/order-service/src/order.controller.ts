import { Controller } from '@nestjs/common';
import {
  OrderResponse,
  OrdersServiceControllerMethods,
  OrderUpdateResponse,
  OrderUpdateStatusDto,
} from '@app/common';
import {
  FindOneOrderDto,
  Order,
  OrderFilterDto,
  Orders,
  OrdersServiceController,
  OrderWithPagination,
  QueryOrderWithPagination,
  SortDirection,
} from '@app/common/types';

import { OrderService } from './order.service';
import { SortOrderDto } from './dto';

@Controller()
@OrdersServiceControllerMethods()
export class OrderController implements OrdersServiceController {
  constructor(private readonly orderService: OrderService) {}

  updateOrderStatus(
    request: OrderUpdateStatusDto,
  ): Promise<OrderUpdateResponse> | OrderUpdateResponse {
    return this.orderService.updateOrderStatus(request);
  }

  async findOrders(dto: OrderFilterDto): Promise<Orders> {
    console.log('Finding orders', { metadata: dto });
    await this.orderService.findOrders(); // we will implement this method in the next steps
    return Promise.resolve({ orders: [], total: 0 });
  }

  async findOneOrder(dto: FindOneOrderDto): Promise<Order | null> {
    console.log('Finding order', { metadata: dto });
    return Promise.resolve(null);
  }

  async findOrdersWithPagination(args: QueryOrderWithPagination): Promise<OrderWithPagination> {
    const { page, pageSize, sorts } = args;

    const paginationOptions = { page, pageSize };
    const sortsFormatted = sorts?.map(sort => ({
      column: sort.field,
      direction: sort.direction === SortDirection.ASC ? 'ASC' : 'DESC',
    })) as SortOrderDto[];

    const { metadata } = await this.orderService.findOrdersWithPagination({
      paginationOptions,
      sorts: sortsFormatted ?? [],
    });

    return { orders: [], total: metadata.total };
  }
}
