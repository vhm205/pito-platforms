import { RoleType } from '@gateway/constants';
import { Auth } from '@gateway/decorators';
import { ApiPageWrapperResponse } from '@gateway/decorators';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { PaginationQueryDto } from '@gateway/gateway-common/dto/query-dto';
import { emptyPaginationResponse } from '@gateway/utils/common';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { OrderDto } from './dto/order.dto';
import { OperatorOrderFilterDto } from './dto/query-order.dto';
import { OperatorOrderService } from './operator-order.service';
import { transformCustomer, transformFilterOrder, transformOrderItem } from './utils/transformer';

@Controller('operator/orders')
export class OperatorOrdersController {
  constructor(private readonly service: OperatorOrderService) {}

  @Get()
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: OrderDto })
  async getListOrders(@Query() query: PaginationQueryDto<OperatorOrderFilterDto>) {
    const transformedQuery = Object.assign(query, {
      filter: query.filter?.map(transformFilterOrder) ?? [],
    });
    const { orders, totalCount } = await this.service.getListOrders(transformedQuery);
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
      OrderDto,
      orders.map(order =>
        Object.assign(order, {
          store: storesMap.get(order.storeId),
          customer: transformCustomer(order),
          orderItems: order.orderItems.map(transformOrderItem),
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
}
