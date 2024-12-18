import {
  FindOrderRequest,
  FindStoreOrderRequest,
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  ORDER_SERVICE,
  ORDERS_SERVICE_NAME,
  OrdersServiceClient,
} from '@app/common';
import { FilterRule } from '@app/common/types/proto/common';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { OperatorQueryOrderDto, OperatorQueryStoreOrderDto } from './dto/query-order.dto';
import { transformCustomer } from './utils/transformer';

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

  async getListOrders(query: OperatorQueryOrderDto) {
    return firstValueFrom(
      this.orderServiceClient.findOrders({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: query.sorts,
      }),
    );
  }

  async getOrderDetails({ id, orderCode }: Pick<FindOrderRequest, 'id' | 'orderCode'>) {
    const { order } = await firstValueFrom(this.orderServiceClient.findOrder({ id, orderCode }));
    if (!order) throw new NotFoundException('We could not find the order');

    const store = await firstValueFrom(
      this.menuServiceClient.findStore({ id: order.storeId }),
    ).then(({ store }) => store!);

    return Object.assign(order, { store, customer: transformCustomer(order) });
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

  async getStoreOrderDetails(args: Pick<FindStoreOrderRequest, 'id' | 'orderCode' | 'orderId'>) {
    return firstValueFrom(this.orderServiceClient.findStoreOrder(args));
  }

  async getListStoreOrders(query: OperatorQueryStoreOrderDto) {
    return firstValueFrom(
      this.orderServiceClient.findStoreOrders({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: query.sorts,
      }),
    );
  }
}
