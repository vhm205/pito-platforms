import {
  DEFAULT_PAGE_NUMBER,
  FindOrderRequest,
  FindStoreOrderRequest,
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  Order,
  ORDER_SERVICE,
  ORDERS_SERVICE_NAME,
  OrdersServiceClient,
} from '@app/common';
import { FilterRule, OrderStatus } from '@app/common/types/proto/common';
import { RefundOrderStatus } from '@gateway/enums/status';
import { constructFullName } from '@gateway/utils/common';
import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { assign, get, isEmpty, map } from 'lodash';
import { firstValueFrom } from 'rxjs';

import { AuthenticatedUser } from '../auth/auth-user.interface';

import { ChangeLogEntry, ChangeLogType, OperatorNoteEntry } from './dto/common.dto';
import { OperatorUpdateOrderDto } from './dto/operator-update-order.dto';
import {
  OperatorQueryOrderDto,
  OperatorQueryStoreOrderDto,
  RefundOrderQueryDto,
} from './dto/query-order.dto';
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

  async getOrderWithStore({ id, orderCode }: Pick<FindOrderRequest, 'id' | 'orderCode'>) {
    const { order } = await firstValueFrom(this.orderServiceClient.findOrder({ id, orderCode }));
    if (!order) throw new NotFoundException('We could not find the order');

    const store = await firstValueFrom(
      this.menuServiceClient.findStore({ id: order.storeId }),
    ).then(({ store }) => store!);

    return Object.assign(order, { store, customer: transformCustomer(order) });
  }

  async getStoreById(storeId: string) {
    return firstValueFrom(this.menuServiceClient.findStore({ id: storeId }));
  }

  async getOrderDetails(args: Pick<FindOrderRequest, 'id' | 'orderCode'>) {
    return firstValueFrom(this.orderServiceClient.findOrder(args));
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

  async operatorUpdateOrder(args: {
    user: AuthenticatedUser;
    order: Order;
    updateOrderPayload: OperatorUpdateOrderDto;
  }) {
    const { user, order, updateOrderPayload } = args;
    const currentTimestamp = new Date().toISOString();
    const operatorDisplayName = constructFullName(user.firstName, user.lastName) || user.email;

    const changeLogs: ChangeLogEntry[] = get(order, 'metadata.changeLogs', []);

    if (updateOrderPayload.operationNote) {
      const operationNotes: OperatorNoteEntry[] = get(order, 'metadata.operationNotes', []);
      operationNotes.push({
        user: operatorDisplayName,
        description: updateOrderPayload.operationNote,
        timestamp: currentTimestamp,
      });
      order.metadata = assign(order.metadata, { operationNotes });
    }

    if (updateOrderPayload.status) {
      changeLogs.push({
        user: operatorDisplayName,
        changeType: ChangeLogType.STATUS_UPDATE,
        oldValue: order.operatorStatusCode.toString(),
        newValue: updateOrderPayload.status.toString(),
        timestamp: currentTimestamp,
      });
      order.operatorStatusCode = updateOrderPayload.status;
      order.statusCode = updateOrderPayload.status;

      if (updateOrderPayload.status === OrderStatus.CANCELED) {
        order.refundStatus = RefundOrderStatus.PENDING;
      }

      await Promise.all([
        firstValueFrom(
          this.orderServiceClient.updateOrderStatus({
            id: order.id,
            status: updateOrderPayload.status,
            timestamp: new Date(currentTimestamp),
          }),
        ),
        firstValueFrom(
          this.orderServiceClient.updateStoreOrderStatus({
            orderId: order.id,
            status: updateOrderPayload.status,
          }),
        ),
      ]);
    }

    if (updateOrderPayload.refundStatus) {
      changeLogs.push({
        user: operatorDisplayName,
        changeType: ChangeLogType.REFUND_STATUS_UPDATE,
        oldValue: order.refundStatus.toString(),
        newValue: updateOrderPayload.refundStatus.toString(),
        description: `Đã xác nhận hoàn tiền cho khách hàng`,
        timestamp: currentTimestamp,
      });
      order.refundStatus = updateOrderPayload.refundStatus;
      order.metadata = assign(order.metadata, { changeLogs });
    }

    if (updateOrderPayload.imageUrls) {
      const imageUrls = get(order, 'metadata.imageUrls', []);
      imageUrls.push(...updateOrderPayload.imageUrls);
      order.metadata = assign(order.metadata, { imageUrls });
    }

    return this.orderServiceClient.updateOrder({
      id: order.id,
      metadata: order.metadata,
      refundStatus: order.refundStatus,
      // operatorStatusCode: order.operatorStatusCode,
      // statusCode: order.statusCode,
      // operationNotes,
      // changeLogs,
    });
  }

  async getListRefundOrders(query: RefundOrderQueryDto) {
    const { orders, totalCount } = await firstValueFrom(
      this.orderServiceClient.findOrders({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: query.sorts,
      }),
    );

    // return early if no orders found
    if (isEmpty(orders)) return { orders: [], totalCount };

    const orderIds = map(orders, order => order.id);
    const { transactions } = await firstValueFrom(
      this.orderServiceClient.findTransactions({
        filters: [
          {
            column: 'orderId',
            operator: 'in',
            value: orderIds.join(','),
          },
        ],
        pagination: { currentPage: DEFAULT_PAGE_NUMBER, pageSize: orderIds.length },
        sorts: [],
      }),
    );

    const transactionsMap = new Map(
      map(transactions, transaction => [transaction.orderId, transaction]),
    );
    const ordersWithTransactions = map(orders, order => ({
      ...order,
      customer: transformCustomer(order),
      transaction: transactionsMap.get(order.id),
    }));

    return {
      orders: ordersWithTransactions,
      totalCount,
    };
  }
}
