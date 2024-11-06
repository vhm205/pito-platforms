import { pagePagination } from '@app/common';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { PaginationOptions } from '@app/common/types/common';
import { FilterOrderDto, SortOrderDto } from './dto';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';

import { OrderUpdateStatusDto, SendNotificationDto } from '@app/common/types';
import { Channel, PushType } from '@app/common/enums';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject('NOTIFICATIONS_SERVICE') private rabbitClient: ClientProxy,
  ) {}

  updateOrderStatus(payload: OrderUpdateStatusDto) {
    // TODO: example will be removed after
    const message: SendNotificationDto = {
      notificationType: 'OrderStatusUpdated',
      channels: [Channel.EMAIL],
      message: {
        email: {
          from: 'no-reply@pito.vn',
          to: 'minh.vu@pito.vn',
          subject: 'This is test subject',
          templateId: 'd-106f40945f10466e807b974a0c22176e',
          dynamicTemplateData: payload,
        },
        // pushNotification: {
        //   type: PushType.TOPIC,
        //   topic: payload.orderId,
        //   android: {
        //     priority: 'high',
        //   },
        //   data: {
        //     title: 'This is test title',
        //     body: 'This is test body',
        //   },
        // },
      },
    };

    const record = new RmqRecordBuilder(message)
      .setOptions({
        headers: {
          ['x-version']: '1.0.0',
        },
        priority: 0,
        persistent: true,
      })
      .build();

    this.rabbitClient.emit('notification.sent', record);

    return {
      message: 'Order updated successfully',
      statusCode: 201,
      success: true,
    };
  }

  findOrders() {
    return Promise.resolve([[], 0]);
  }

  async findOrdersWithPagination(options: {
    paginationOptions: PaginationOptions;
    sorts: SortOrderDto[];
    filters?: FilterOrderDto;
  }) {
    const [orders, count] = await this.orderRepository.findOrdersWithPagination({
      paginationOptions: options.paginationOptions,
      sorts: options.sorts,
      filters: options.filters,
    });

    return pagePagination(orders, {
      total: count,
      page: options.paginationOptions.page,
      pageSize: options.paginationOptions.pageSize,
    });
  }
}
