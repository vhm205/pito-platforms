import { CUSTOMER_DB_SOURCE, LoggerService } from '@app/common';
import { NullableType, PaginationOptions } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere, Repository } from 'typeorm';

import { Order } from '../../../../domain/order';
import { FilterOrderDto, SortOrderDto } from '../../../../dto';
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
    filter: FindOptionsWhere<Pick<Order, 'id' | 'orderCode' | 'storeId'>>,
  ): Promise<NullableType<Order>> {
    const entity = await this.orderRepository.findOne({ where: filter });
    return entity ? OrderMapper.toDomain(entity) : null;
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

  saveOrder(order: Omit<Order, 'id'>): Promise<Order> {
    this.logger.log('Saving order', { metadata: order });
    throw new Error('Method not implemented.');
  }

  async updateOrder(order: Order): Promise<NullableType<Order>> {
    const updatedEntity = await this.orderRepository.save(OrderMapper.toPersistence(order));
    return OrderMapper.toDomain(updatedEntity);
  }

  deleteOrder(order: Order['id']): Promise<void> {
    this.logger.log('Deleting order', { metadata: order });
    throw new Error('Method not implemented.');
  }
}
