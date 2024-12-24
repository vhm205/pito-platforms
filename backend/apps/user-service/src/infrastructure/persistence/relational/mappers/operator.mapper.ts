import { getImageUrl } from '@app/common';
import { Operator } from 'apps/user-service/src/domain/operator.domain';

import { OperatorEntity } from '../entities/operator.entity';

export class OperatorMapper {
  static toDomain(raw: OperatorEntity): Operator {
    const domain = new Operator();

    domain.id = raw.id;
    domain.name = raw.name;
    domain.email = raw.email;
    domain.phone = raw.phone;
    domain.avatarUrl = raw.avatarUrl ? getImageUrl(raw.avatarUrl) : '';
    domain.firstName = raw.firstName;
    domain.lastName = raw.lastName;
    domain.metadata = raw.metadata;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;

    return domain;
  }
}
