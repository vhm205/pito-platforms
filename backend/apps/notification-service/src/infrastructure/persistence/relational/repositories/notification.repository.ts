import { CUSTOMER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'apps/notification-service/src/domain/notification.domain';
import type { FindOperator, FindOptionsWhere, Repository } from 'typeorm';

import { NotificationRepository } from '../../notification.repository';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationMapper } from '../mappers/notification.mapper';

@Injectable()
export class NotificationRelationalRepository implements NotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity, CUSTOMER_DB_SOURCE)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  async findOne(
    filter: FindOptionsWhere<Pick<Notification, 'id'>>,
  ): Promise<NullableType<Notification>> {
    const entity = await this.notificationRepository.findOne({ where: filter });
    return entity ? NotificationMapper.toDomain(entity) : null;
  }

  async findNotificationsWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Notification[], number]> {
    const { pagination, sorts, filters } = options;

    const [entities, total] = await this.notificationRepository.findAndCount({
      skip: (pagination.currentPage - 1) * pagination.pageSize, // 1-based index
      take: pagination.pageSize,
      where: filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
      order: Object.fromEntries(sorts.map(sort => [sort.column, sort.direction])),
    });

    const domainEntities = entities.map(NotificationMapper.toDomain);
    return [domainEntities, total];
  }

  async getTotalNotificationByFilter(
    filter?: FindOptionsWhere<Pick<Notification, 'userId' | 'status' | 'type'>>,
  ): Promise<number> {
    return this.notificationRepository.count({ where: filter });
  }
}
