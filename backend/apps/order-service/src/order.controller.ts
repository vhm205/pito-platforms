import { OrdersServiceControllerMethods } from '@app/common';
import {
  FindOneOrderDto,
  Order,
  OrderFilterDto,
  Orders,
  OrdersServiceController,
} from '@app/common/types';
import { Controller } from '@nestjs/common';

import { OrderService } from './order.service';

@Controller()
@OrdersServiceControllerMethods()
export class OrderController implements OrdersServiceController {
  constructor(private readonly orderService: OrderService) {}

  async findOrders(request: OrderFilterDto): Promise<Orders> {
    const orders = await this.orderService.findOrders(request);

    return orders;
  }

  async findOneOrder(request: FindOneOrderDto): Promise<Order | null> {
    const order = await this.orderService.findOneOrder(request.id);

    return order;
  }
}
