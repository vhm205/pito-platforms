import { UpdateOrderStatusRequest, User } from '@app/common';
import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, AuthUser } from '@gateway/decorators';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { emptyPaginationResponse } from '@gateway/utils/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Inject,
  Put,
  Body,
  Query,
} from '@nestjs/common';
import type { RedisStore } from 'cache-manager-redis-yet';
import { plainToInstance } from 'class-transformer';

import { Auth } from '../../decorators/http.decorator';

import { OrderListingDto } from './dto/order-listing.dto';
import { UserQueryOrderHistoryDto } from './dto/query-order.dto';
import { OrdersService } from './orders.service';
import { transformCustomer } from './utils/transformer';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly service: OrdersService,
    @Inject(CACHE_MANAGER) private cacheManager: RedisStore,
  ) {}

  @Get('test')
  @Auth([RoleType.CUSTOMER])
  async test() {
    await this.cacheManager.set('key', '1.0.34', 100 * 1000);

    const result = await this.cacheManager.get('key');

    return { result };
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  updateStatus(@Body() updateOrderDto: UpdateOrderStatusRequest) {
    return this.service.updateOrderStatus(updateOrderDto);
  }

  @Get()
  @Auth([RoleType.CUSTOMER])
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: OrderListingDto })
  async getUserOrdersHistory(@Query() query: UserQueryOrderHistoryDto, @AuthUser() user: User) {
    query.filters.push({ column: 'customerId', operator: 'eq', value: user.id });
    const { orders, totalCount } = await this.service.getListOrders(query);

    if (!orders?.length) {
      return emptyPaginationResponse({
        page: query.page,
        pageSize: query.pageSize,
        totalCount,
      });
    }

    const storeIds = Array.from(new Set(orders.map(order => order.storeId)));
    const storesMap = await this.service
      .getStoresByIds([...storeIds])
      .then(({ stores }) => new Map(stores.map(store => [store.id, store])));

    const transformedOrders = plainToInstance(
      OrderListingDto,
      orders.map(order =>
        Object.assign(order, {
          store: storesMap.get(order.storeId),
          customer: transformCustomer(order),
        }),
      ),
      { excludeExtraneousValues: true },
    );
    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto(transformedOrders, pageMeta);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.service.getOrderDetail(id);
  }
}
