import { Notification } from 'apps/notification-service/src/domain/notification.domain';

import { NotificationEntity } from '../entities/notification.entity';

export class NotificationMapper {
  static toDomain(raw: NotificationEntity): Notification {
    const domain = new Notification();

    domain.id = raw.id;
    domain.title = raw.title;
    domain.message = raw.message;
    domain.type = raw.type;
    domain.status = raw.status;
    domain.sendAt = raw.sendAt;
    domain.userId = raw.userId;
    domain.createdAt = raw.createdAt;

    return domain;
  }

  static toPersistence(domainEntity: Notification): NotificationEntity {
    const entity = new NotificationEntity();

    entity.id = domainEntity.id;
    entity.title = domainEntity.title;
    entity.message = domainEntity.message;
    entity.type = domainEntity.type;
    entity.status = domainEntity.status;
    entity.sendAt = domainEntity.sendAt;
    entity.userId = domainEntity.userId;
    entity.createdAt = domainEntity.createdAt;

    return entity;
  }
}
