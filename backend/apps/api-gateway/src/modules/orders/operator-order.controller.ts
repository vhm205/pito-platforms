import { RoleType } from '@gateway/constants';
import { Auth } from '@gateway/decorators';
import { ApiPageWrapperResponse } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { emptyPaginationResponse, isValidUUID } from '@gateway/utils/common';
import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { OrderDetailDto } from './dto/order-detail.dto';
import { OrderListingDto } from './dto/order-listing.dto';
import { OperatorQueryOrderDto } from './dto/query-order.dto';
import { OperatorOrderService } from './operator-order.service';
import { transformCustomer } from './utils/transformer';

@Controller('operator/orders')
export class OperatorOrdersController {
  constructor(private readonly service: OperatorOrderService) {}

  @Get()
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: OrderListingDto })
  async getListOrders(@Query() query: OperatorQueryOrderDto) {
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

    return new PageDto<OrderListingDto>(transformedOrders, pageMeta);
  }

  @Get('/:orderIdentifier')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: OrderDetailDto })
  async getOrderDetails(@Param('orderIdentifier') orderIdentifier: string) {
    const queryParam = isValidUUID(orderIdentifier)
      ? { id: orderIdentifier }
      : { orderCode: orderIdentifier };

    const order = await this.service.getOrderDetails(queryParam);
    const transformedOrder = plainToInstance(OrderDetailDto, order, {
      excludeExtraneousValues: true,
    });

    return transformedOrder;
  }
}
