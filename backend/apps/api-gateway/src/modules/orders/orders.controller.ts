import { User } from '@app/common';
import { Controller, Get, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { GetListOrderDto, getListOrderSchema } from './dto/get-list-order.dto';
import { OrdersService } from './orders.service';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorator';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getList(
    @Query(new ZodValidationPipe(getListOrderSchema)) getListOrderDto: GetListOrderDto,
    @AuthUser() user: User,
  ) {
    const orders = await this.ordersService.getHistoryOrders(user.id, getListOrderDto);

    return orders;
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.ordersService.getOrderDetail(id);
  }
}
