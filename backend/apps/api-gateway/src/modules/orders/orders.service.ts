import { ORDER_SERVICE, ORDERS_SERVICE_NAME, OrdersServiceClient } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { GetListOrderDto } from './dto/get-list-order.dto';

@Injectable()
export class OrdersService {
  private ordersService: OrdersServiceClient;

  constructor(@Inject(ORDER_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.ordersService = this.client.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);
  }

  getHistoryOrders(userId: string, getListOrderDto: GetListOrderDto) {
    return firstValueFrom(
      this.ordersService.findOrders({
        userId,
        keyword: null,
        status: null,
        fromDate: null,
        toDate: null,
        deliveryDate: null,
        ...getListOrderDto,
        sortBy: null,
        sortDirection: null,
        pageSize: null,
        from: null,
      }),
    );
  }

  getOrderDetail(id: string) {
    return this.ordersService.findOneOrder({ id }).toPromise();
  }
}
