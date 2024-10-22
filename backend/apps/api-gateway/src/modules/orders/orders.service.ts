import { ORDER_SERVICE, ORDERS_SERVICE_NAME, OrdersServiceClient } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  private ordersService: OrdersServiceClient;

  constructor(@Inject(ORDER_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.ordersService = this.client.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);
  }

  getHistoryOrders() {
    return this.ordersService
      .findOrders({
        userId: null,
        keyword: null,
        status: null,
        fromDate: null,
        toDate: null,
        deliveryDate: null,
        sortBy: null,
        sortDirection: null,
        pageSize: null,
        from: null,
      })
      .toPromise();
  }

  getOrderDetail(id: string) {
    return this.ordersService.findOneOrder({ id }).toPromise();
  }
}
