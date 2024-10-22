import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { Auth } from '../../decorators/http.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getList() {
    const orders = await this.ordersService.getHistoryOrders();

    return orders;
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.ordersService.getOrderDetail(id);
  }
}
