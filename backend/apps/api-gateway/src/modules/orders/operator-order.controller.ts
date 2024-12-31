import { DEFAULT_PAGE_NUMBER } from '@app/common';
import { OrderStatus } from '@app/common/types/proto/common';
import { RoleType } from '@gateway/constants';
import { Auth, AuthUser } from '@gateway/decorators';
import { ApiPageWrapperResponse } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { emptyPaginationResponse, isValidUUID } from '@gateway/utils/common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { find, get, identity, isEmpty, map, pickBy } from 'lodash';

import { AuthenticatedUser } from '../auth/auth-user.interface';

import { InvoiceRequestDto } from './dto/invoice-request.dto';
import { OperatorUpdateOrderDto } from './dto/operator-update-order.dto';
import { OrderDetailDto } from './dto/order-detail.dto';
import { OrderListingDto } from './dto/order-listing.dto';
import {
  OperatorQueryOrderDto,
  OperatorQueryStoreOrderDto,
  RefundOrderQueryDto,
} from './dto/query-order.dto';
import { RefundOrderListingDto } from './dto/refund-order-listing.dto';
import { StoreOrderListingDto } from './dto/store-order-listing.dto';
import { OperatorOrderService } from './operator-order.service';
import { transformCustomer } from './utils/transformer';

const ORDER_STATUS_TRANSITION = new Map([
  [
    OrderStatus.WAITING_FOR_CONFIRMATION,
    [OrderStatus.CONFIRMED, OrderStatus.UNCONFIRMED, OrderStatus.CANCELED],
  ],
  [OrderStatus.CONFIRMED, [OrderStatus.PREPARING, OrderStatus.CANCELED]],
  [OrderStatus.PREPARING, [OrderStatus.PREPARED, OrderStatus.CANCELED]],
]);

@Controller('operator')
export class OperatorOrdersController {
  constructor(private readonly service: OperatorOrderService) {}

  @Get('/orders')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: OrderListingDto })
  async getListOrders(@Query() query: OperatorQueryOrderDto) {
    const transformedFilters = query.filters.map(filter => {
      if (filter.column === 'status') return { ...filter, column: 'operatorStatusCode' };
      return filter;
    });
    query.filters = transformedFilters;

    const { orders, totalCount } = await this.service.getListOrders(query);
    if (isEmpty(orders)) {
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
      map(orders, order => ({
        ...order,
        status: order.operatorStatusCode,
        store: storesMap.get(order.storeId),
        customer: transformCustomer(order),
      })),
      { excludeExtraneousValues: true },
    );
    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto<OrderListingDto>(transformedOrders, pageMeta);
  }

  @Get('/orders/:orderIdentifier')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: OrderDetailDto })
  async getOrderDetails(@Param('orderIdentifier') identifier: string) {
    const queryParam = isValidUUID(identifier) ? { id: identifier } : { orderCode: identifier };

    const { order } = await this.service.getOrderDetails(queryParam);
    if (!order) {
      throw new NotFoundException('We could not find the order with the provided identifier');
    }
    const store = await this.service.getStoreById(order.storeId).then(({ store }) => store!);
    const transformedOrder = plainToInstance(
      OrderDetailDto,
      Object.assign(order, {
        store,
        status: order.operatorStatusCode,
        customer: transformCustomer(order),
      }),
      {
        excludeExtraneousValues: true,
      },
    );

    return transformedOrder;
  }

  @Get('/orders/:orderIdentifier/vat-info')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: InvoiceRequestDto })
  async getVatInfo(@Param('orderIdentifier') identifier: string) {
    const queryParam = isValidUUID(identifier)
      ? { orderId: identifier }
      : { orderCode: identifier };

    const { storeOrder } = await this.service.getStoreOrderDetails(queryParam);
    if (isEmpty(storeOrder)) {
      throw new NotFoundException('We could not find the order with the provided identifier');
    }

    return plainToInstance(
      InvoiceRequestDto,
      {
        orderId: storeOrder.orderId,
        storeId: storeOrder.storeId,
        orderCode: storeOrder.orderCode,
        invoiceRequested: !isEmpty(pickBy(storeOrder.invoiceRequest, identity)),
        invoiceUrlAvailable: !isEmpty(storeOrder.metadata?.invoiceUrl),
        vatInfo: get(storeOrder, 'invoiceRequest'),
        invoiceUrl: storeOrder.metadata?.invoiceUrl,
      },
      { excludeExtraneousValues: true },
    );
  }

  @Get('/store-orders')
  @Auth([RoleType.OPERATOR])
  @ApiPageWrapperResponse({ type: StoreOrderListingDto })
  async getListStoreOrders(@Query() query: OperatorQueryStoreOrderDto) {
    const storesMap = new Map();
    const vatFilter = query.filters.find(filter => filter.column === 'isVat');

    if (vatFilter) {
      const { stores } = await this.service.filterStores(vatFilter, DEFAULT_PAGE_NUMBER, 1000); // TODO: Need to change this later
      if (isEmpty(stores)) {
        return emptyPaginationResponse({
          page: query.page,
          pageSize: query.pageSize,
          totalCount: 0,
        });
      }

      // Update filters by removing VAT and adding store filter
      query.filters = query.filters.filter(filter => filter.column !== vatFilter.column);
      query.filters.push({
        column: 'storeId',
        operator: 'in',
        value: map(stores, store => store.id).join(','),
      });

      stores.forEach(store => storesMap.set(store.id, store));
    }

    const { orders, totalCount } = await this.service.getListStoreOrders(query);
    if (isEmpty(orders)) {
      return emptyPaginationResponse({
        page: query.page,
        pageSize: query.pageSize,
        totalCount,
      });
    }

    // If has vat is not present, fetch store details for each order
    if (!vatFilter) {
      const storeIds = Array.from(new Set(orders.map(order => order.storeId)));
      const { stores } = await this.service.filterStores(
        {
          column: 'id',
          operator: 'in',
          value: storeIds.join(','),
        },
        DEFAULT_PAGE_NUMBER,
        storeIds.length,
      );
      stores.forEach(store => storesMap.set(store.id, store));
    }

    const transformedOrders = plainToInstance(
      StoreOrderListingDto,
      map(orders, order => Object.assign(order, { store: storesMap.get(order.storeId) })),
      { excludeExtraneousValues: true },
    );
    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto<StoreOrderListingDto>(transformedOrders, pageMeta);
  }

  @Put('/orders/:orderIdentifier')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  // @ApiWrapperResponse({ type: InvoiceRequestDto }) // TODO: Add response type later
  @ApiBody({ type: OperatorUpdateOrderDto })
  async operatorUpdateOrder(
    @AuthUser() user: AuthenticatedUser,
    @Param('orderIdentifier') identifier: string,
    @Body() updateOrderPayload: OperatorUpdateOrderDto,
  ) {
    if (isEmpty(updateOrderPayload)) {
      throw new BadRequestException('Request body must not be empty');
    }

    const queryParam = isValidUUID(identifier) ? { id: identifier } : { orderCode: identifier };
    const { order } = await this.service.getOrderDetails(queryParam);
    if (!order) {
      throw new NotFoundException('We could not find the order with the provided identifier');
    }

    if (updateOrderPayload.status) {
      const allowedStatus = ORDER_STATUS_TRANSITION.get(order.statusCode);
      if (!allowedStatus || !allowedStatus.includes(updateOrderPayload.status)) {
        throw new BadRequestException(
          `Cannot transition status of order from ${order.statusCode} to ${updateOrderPayload.status}`,
        );
      }
    }

    return this.service.operatorUpdateOrder({ user, order, updateOrderPayload });
  }

  @Get('/refund-orders')
  @Auth([RoleType.OPERATOR])
  @ApiPageWrapperResponse({ type: RefundOrderListingDto })
  async getRefundOrders(@Query() query: RefundOrderQueryDto) {
    if (!find(query.filters, { column: 'refundStatus' })) {
      query.filters.push({
        column: 'refundStatus',
        operator: 'is',
        value: 'not null',
      });
    }
    query.filters.push({
      column: 'statusCode',
      operator: 'in',
      value: [OrderStatus.CANCELED, OrderStatus.REJECTED, OrderStatus.UNCONFIRMED].join(','),
    });

    const { orders, totalCount } = await this.service.getListRefundOrders(query);
    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto<RefundOrderListingDto>(
      plainToInstance(RefundOrderListingDto, orders, { excludeExtraneousValues: true }),
      pageMeta,
    );
  }
}
