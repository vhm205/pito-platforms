import { PARTNER_DB_SOURCE } from '@app/common';
import { StoreOrderStatus } from '@app/common/enums';
import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetRevenueAndCountDto } from 'apps/order-service/src/dto/get-revenue-and-count.dto';
import type { Repository, FindOptionsWhere, FindOperator } from 'typeorm';

import { StoreOrder } from '../../../../domain';
import { StoreOrderRepository } from '../../store-order.repository';
import { StoreOrderEntity } from '../entities/store-order.entity';
import { StoreOrderMapper } from '../mappers/store-order.mapper';

@Injectable()
export class StoreOrderRelationalRepository implements StoreOrderRepository {
  constructor(
    @InjectRepository(StoreOrderEntity, PARTNER_DB_SOURCE)
    private readonly repository: Repository<StoreOrderEntity>,
  ) {}

  async findOne(
    filters: FindOptionsWhere<
      Pick<StoreOrder, 'id' | 'storeId' | 'orderId' | 'orderCode' | 'status'>
    >,
  ): Promise<NullableType<StoreOrder>> {
    const entity = await this.repository.findOne({
      where: filters,
    });
    return entity ? StoreOrderMapper.toDomain(entity) : null;
  }

  async findWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[StoreOrder[], number]> {
    const { pagination, sorts, filters } = options;
    const [entities, total] = await this.repository.findAndCount({
      skip: (pagination.currentPage - 1) * pagination.pageSize,
      take: pagination.pageSize,
      where: filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
      order: Object.fromEntries(sorts.map(sort => [sort.column, sort.direction])),
    });
    const domainEntities = entities.map(entity => StoreOrderMapper.toDomain(entity));
    return [domainEntities, total];
  }

  async update(storeOrder: StoreOrder): Promise<StoreOrder> {
    const updatedEntity = await this.repository.save(StoreOrderMapper.toPersistence(storeOrder));
    return StoreOrderMapper.toDomain(updatedEntity);
  }

  async getTotalRevenueAndCountOrders(storeIds: string[]): Promise<GetRevenueAndCountDto[]> {
    const result = await this.repository
      .createQueryBuilder('storeOrder')
      .select('storeOrder.storeId', 'storeId')
      .addSelect('COUNT(storeOrder.id)', 'totalOrders')
      .addSelect('SUM(storeOrder.totalPrice)', 'totalRevenue')
      .where('storeOrder.storeId IN (:...storeIds)', { storeIds })
      .groupBy('storeOrder.storeId')
      .getRawMany();

    return result.map(({ storeId, totalRevenue, totalOrders }) => ({
      storeId,
      totalRevenue: +totalRevenue,
      totalOrders: +totalOrders,
    }));
  }

  async getTotalOrderCountByStoreId(storeId: string): Promise<number> {
    return this.repository.count({
      where: { storeId, status: StoreOrderStatus.COMPLETED },
    });
  }
}
