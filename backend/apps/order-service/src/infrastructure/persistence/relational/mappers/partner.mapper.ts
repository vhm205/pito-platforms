import { Partner } from 'apps/order-service/src/domain';

import { PartnerEntity } from '../entities/partner.entity';

export class PartnerMapper {
  static toDomain(raw: PartnerEntity): Partner {
    const domain = new Partner();

    domain.id = raw.id;
    domain.partnerName = raw.partnerName;
    domain.isActive = raw.isActive;
    domain.isVat = raw.isVat;
    domain.serviceFeeRate = raw.serviceFeeRate;
    domain.status = raw.status;

    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;

    return domain;
  }
}
