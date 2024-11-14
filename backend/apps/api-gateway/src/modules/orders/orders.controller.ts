import { User } from '@app/common';
import { RoleType } from '@gateway/constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Param, HttpCode, HttpStatus, Query, Inject } from '@nestjs/common';
import { RedisStore } from 'cache-manager-redis-yet';

import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorator';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';

import { GetListOrderDto, getListOrderSchema } from './dto/get-list-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(CACHE_MANAGER) private cacheManager: RedisStore,
  ) {}

  @Get('test')
  @Auth([RoleType.CUSTOMER])
  async test() {
    await this.cacheManager.set('key', '1.0.34', 100 * 1000);

    const result = await this.cacheManager.get('key');

    return { result };
  }

  @Get('test-partner')
  @Auth([RoleType.PARTNER])
  async testPartner() {
    await this.cacheManager.set('key', '1.0.34', 100 * 1000);

    const result = await this.cacheManager.get('key');

    return { result };
  }

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
