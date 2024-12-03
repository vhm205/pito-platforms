import {
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  ORDER_SERVICE,
  ORDERS_SERVICE_NAME,
  OrdersServiceClient,
} from '@app/common';
import { PaginationQueryDto } from '@gateway/gateway-common/dto/query-dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { OperatorOrderFilterDto } from './dto/query-order.dto';

@Injectable()
export class OperatorOrderService implements OnModuleInit {
  private orderServiceClient: OrdersServiceClient;
  private menuServiceClient: MenusServiceClient;
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientGrpc,
    @Inject(MENU_SERVICE) private readonly menuClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.orderServiceClient = this.orderClient.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);
    this.menuServiceClient = this.menuClient.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  async getListOrders(query: PaginationQueryDto<OperatorOrderFilterDto>) {
    return firstValueFrom(
      this.orderServiceClient.findOrders({
        filters: query.filter,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: query.sort,
      }),
    );
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
        pagination: undefined,
        sorts: [],
      }),
    );
  }
}
