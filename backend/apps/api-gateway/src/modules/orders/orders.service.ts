import {
  ORDER_SERVICE,
  ORDERS_SERVICE_NAME,
  OrdersServiceClient,
  OrderUpdateStatusDto,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { timeout, firstValueFrom } from 'rxjs';

import { GetListOrderDto } from './dto/get-list-order.dto';

@Injectable()
export class OrdersService {
  private ordersService: OrdersServiceClient;

  constructor(@Inject(ORDER_SERVICE) private client: ClientGrpc) {
    this.ordersService = this.client.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);
  }

  updateOrderStatus(payload: OrderUpdateStatusDto) {
    const source$ = this.ordersService.updateOrderStatus(payload).pipe(timeout(2000));
    return firstValueFrom(source$);
  }

  getHistoryOrders(userId: string, getListOrderDto: GetListOrderDto) {
    return firstValueFrom(
      this.ordersService.findOrders({
        userId,
        keyword: '',
        status: '',
        fromDate: '',
        toDate: '',
        deliveryDate: '',
        ...getListOrderDto,
        sortBy: '',
        sortDirection: '',
        pageSize: '',
        from: '',
      }),
    );
  }

  getOrderDetail(id: string) {
    return this.ordersService.findOneOrder({ id });
  }
}
