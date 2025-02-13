import { CUSTOMER_DB_SOURCE, LoggerService } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOperator, FindOptionsWhere, Repository } from 'typeorm';

import { Order } from '../../../../domain/order';
import { OrderRepository } from '../../order.repository';
import { OrderEntity } from '../entities/order.entity';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class OrderRelationalRepository implements OrderRepository {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(OrderEntity, CUSTOMER_DB_SOURCE)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async findOne(
    filter: FindOptionsWhere<Pick<Order, 'id' | 'orderCode' | 'storeId' | 'statusCode'>>,
  ): Promise<NullableType<Order>> {
    const entity = await this.orderRepository.findOne({ where: filter });
    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async findAllOrders(filters: Record<string, FindOperator<unknown>>[]): Promise<Order[]> {
    const entities = await this.orderRepository.find({
      where: filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
    });
    return entities.map(entity => OrderMapper.toDomain(entity));
  }

  async findOrdersWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Order[], number]> {
    const { pagination, sorts, filters } = options;
    const [entities, total] = await this.orderRepository.findAndCount({
      skip: (pagination.currentPage - 1) * pagination.pageSize, // 1-based index
      take: pagination.pageSize,
      where: filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
      order: Object.fromEntries(sorts.map(sort => [sort.column, sort.direction])),
    });

    const domainEntities = entities.map(entity => OrderMapper.toDomain(entity));
    return [domainEntities, total];
  }

  async saveOrder(order: Order): Promise<Order> {
    const entity = OrderMapper.toPersistence(order);
    const savedEntity = await this.orderRepository.save(entity);
    return OrderMapper.toDomain(savedEntity);
  }

  async updateOrder(order: Order): Promise<NullableType<Order>> {
    const updatedEntity = await this.orderRepository.save(OrderMapper.toPersistence(order));
    return OrderMapper.toDomain(updatedEntity);
  }

  deleteOrder(order: Order['id']): Promise<void> {
    this.logger.log('Deleting order', { metadata: order });
    throw new Error('Method not implemented.');
  }

  async getLastOrderOfStore(storeId: Order['storeId']): Promise<NullableType<Order>> {
    const [entity] = await this.orderRepository.find({
      where: { storeId },
      order: { orderCount: 'DESC' },
      take: 1,
    });
    return entity ? OrderMapper.toDomain(entity) : null;
  }
}
