import {
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  ORDER_SERVICE,
  ORDERS_SERVICE_NAME,
  OrdersServiceClient,
  UpdateOrderStatusRequest,
} from '@app/common';
import { FilterRule } from '@app/common/types/proto/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { timeout, firstValueFrom } from 'rxjs';

import { UserQueryOrderHistoryDto } from './dto/query-order.dto';

@Injectable()
export class OrdersService {
  private orderServiceClient: OrdersServiceClient;
  private menuServiceClient: MenusServiceClient;

  constructor(
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientGrpc,
    @Inject(MENU_SERVICE) private readonly menuClient: ClientGrpc,
  ) {
    this.orderServiceClient = this.orderClient.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);
    this.menuServiceClient = this.menuClient.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  updateOrderStatus(payload: UpdateOrderStatusRequest) {
    const source$ = this.orderServiceClient.updateOrderStatus(payload).pipe(timeout(2000));
    return firstValueFrom(source$);
  }

  getListOrders(query: UserQueryOrderHistoryDto) {
    return firstValueFrom(
      this.orderServiceClient.findOrders({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: query.sorts,
      }),
    );
  }

  getOrderDetail(id: string) {
    return this.orderServiceClient.findOrder({ id });
  }

  async filterStores(filters: FilterRule | FilterRule[], page: number, pageSize: number) {
    return firstValueFrom(
      this.menuServiceClient.findStores({
        filters: Array.isArray(filters) ? filters : [filters],
        pagination: { currentPage: page, pageSize },
        sorts: [],
      }),
    );
  }

  getTotalRevenueAndCountOrdersByIds(ids: string | string[]) {
    const storeIds = Array.isArray(ids) ? ids : [ids];
    const source$ = this.orderServiceClient
      .getRevenueAndCountOrderByStoreIds({ ids: storeIds })
      .pipe(timeout(3000));
    return firstValueFrom(source$);
  }
}
