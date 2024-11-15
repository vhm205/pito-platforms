import { LoggerService } from '@app/common';
import { NullableType, PaginationOptions } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line import/named
import { FindOptionsWhere, Repository } from 'typeorm';

import { Order } from '../../../../domain/order';
import { FilterOrderDto, SortOrderDto } from '../../../../dto';
import { OrderRepository } from '../../order.repository';
import { OrderEntity } from '../entities/order.entity';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class OrderRelationalRepository implements OrderRepository {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async findOrderById(orderId: Order['id']): Promise<NullableType<Order>> {
    const entity = await this.orderRepository.findOne({ where: { orderId } });
    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async findOrderByCode(orderCode: Order['orderCode']): Promise<NullableType<Order>> {
    const entity = await this.orderRepository.findOne({ where: { orderCode } });
    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async findOrdersByUserId(userId: string): Promise<Order[]> {
    this.logger.log('Finding orders by userId', { metadata: userId });
    // TODO: Add where clause to filter by userId
    const entities = await this.orderRepository.find();

    return entities.map(entity => OrderMapper.toDomain(entity));
  }

  findAllOrders(): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }

  async findOrdersWithPagination(options: {
    paginationOptions: PaginationOptions;
    sorts: Array<SortOrderDto>;
    filters?: FilterOrderDto;
  }): Promise<[Order[], number]> {
    const {
      paginationOptions: { page, pageSize },
      sorts,
      filters,
    } = options;

    const where: FindOptionsWhere<OrderEntity> = {};
    if (filters?.orderCode) {
      where.orderCode = filters.orderCode;
    }

    const [entities, total] = await this.orderRepository.findAndCount({
      skip: (page - 1) * pageSize, // 1-based index
      take: pageSize,
      where,
      order: Object.fromEntries(sorts.map(sort => [sort.column, sort.direction])),
    });

    const domainEntities = entities.map(entity => OrderMapper.toDomain(entity));
    return [domainEntities, total];
  }

  findOrdersInDelivery(): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }

  saveOrder(order: Omit<Order, 'id'>): Promise<Order> {
    this.logger.log('Saving order', { metadata: order });
    throw new Error('Method not implemented.');
  }

  updateOrder(order: Order): Promise<Order> {
    this.logger.log('Updating order', { metadata: order });
    throw new Error('Method not implemented.');
  }

  deleteOrder(order: Order['id']): Promise<void> {
    this.logger.log('Deleting order', { metadata: order });
    throw new Error('Method not implemented.');
  }
}
