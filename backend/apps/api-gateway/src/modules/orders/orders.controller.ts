import { DEFAULT_PAGE_NUMBER, UpdateOrderStatusRequest } from '@app/common';
import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, AuthUser } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { OrderDetailDto } from '@gateway/modules/orders/dto/order-detail.dto';
import { OperatorOrderService } from '@gateway/modules/orders/operator-order.service';
import { emptyPaginationResponse, isValidUUID } from '@gateway/utils/common';
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
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import type { RedisStore } from 'cache-manager-redis-yet';
import { plainToInstance } from 'class-transformer';
import { omit } from 'lodash';

import { Auth } from '../../decorators/http.decorator';
import { AuthenticatedUser } from '../auth/auth-user.interface';

import { OrderListingDto } from './dto/order-listing.dto';
import { UserQueryOrderHistoryDto } from './dto/query-order.dto';
import { OrdersService } from './orders.service';
import { transformCustomer } from './utils/transformer';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly service: OrdersService,
    private readonly operatorOrderService: OperatorOrderService,
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
  async getUserOrdersHistory(
    @Query() query: UserQueryOrderHistoryDto,
    @AuthUser() user: AuthenticatedUser,
  ) {
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
      .filterStores(
        {
          column: 'id',
          operator: 'in',
          value: storeIds.join(','),
        },
        DEFAULT_PAGE_NUMBER,
        storeIds.length,
      )
      .then(({ stores }) => new Map(stores.map(store => [store.id, store])));

    const transformedOrders = plainToInstance(
      OrderListingDto,
      orders.map(order => ({
        ...order,
        status: order.statusCode,
        store: storesMap.get(order.storeId),
        customer: transformCustomer(order),
      })),
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

  @Get('/bill-of-lading/:orderIdentifier')
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: OrderDetailDto })
  async getOrderDetails(@Param('orderIdentifier') identifier: string) {
    try {
      const queryParam = isValidUUID(identifier) ? { id: identifier } : { orderCode: identifier };
      const { order } = await this.operatorOrderService.getOrderDetails(queryParam);

      if (!order) {
        throw new NotFoundException('We could not find the order with the provided identifier');
      }

      const store = await this.operatorOrderService
        .getStoreById(order.storeId)
        .then(({ store }) => store);

      const mergedOrder = Object.assign(order, {
        store,
        status: order.operatorStatusCode,
        customer: transformCustomer(order),
      });

      const transformedOrder = plainToInstance(OrderDetailDto, mergedOrder, {
        excludeExtraneousValues: true,
      });

      const sanitizedOrder = omit(transformedOrder, [
        'totalPrice',
        'subTotalPrice',
        'shippingFee',
        'discountAmount',
        'discountShippingFee',
        'operationNotes',
        'statusHistory',
        'cancelReason',
        'status',
      ]);

      return sanitizedOrder;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch order details: ${(error as Error).message}`,
        (error as any).status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
