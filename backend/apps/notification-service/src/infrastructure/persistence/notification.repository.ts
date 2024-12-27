import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import type { FindOperator, FindOptionsWhere } from 'typeorm';

import { Notification } from '../../domain/notification.domain';

export abstract class NotificationRepository {
  abstract findOne(
    filter: FindOptionsWhere<Pick<Notification, 'id'>>,
  ): Promise<NullableType<Notification>>;

  abstract findNotificationsWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Notification[], number]>;

  abstract getTotalNotificationByFilter(
    filter?: FindOptionsWhere<Pick<Notification, 'userId' | 'status' | 'type'>>,
  ): Promise<number>;
}
