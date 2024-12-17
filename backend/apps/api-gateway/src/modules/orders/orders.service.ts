import {
  DEFAULT_PAGE_NUMBER,
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  ORDER_SERVICE,
  ORDERS_SERVICE_NAME,
  OrdersServiceClient,
  UpdateOrderStatusRequest,
} from '@app/common';
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

  async getStoresByIds(storeIds: string[]) {
    return firstValueFrom(
      this.menuServiceClient.findStores({
        filters: [
          {
            column: 'id',
            operator: 'in',
            value: storeIds.join(','),
          },
        ],
        pagination: { currentPage: DEFAULT_PAGE_NUMBER, pageSize: storeIds.length },
        sorts: [],
      }),
    );
  }
}
