import { Partner } from 'apps/menu-service/src/domain/partner.domain';

import { PartnerEntity } from '../entities/partner.entity';

export class PartnerMapper {
  static toDomain(raw: PartnerEntity): Partner {
    const domain = new Partner();

    domain.id = raw.id;
    domain.name = raw.name;
    domain.status = raw.status;

    domain.businessType = raw.businessType;
    domain.certification = raw.certification;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;

    domain.businessInfo = raw.businessInfo;
    domain.businessOwner = raw.businessOwner;
    domain.bankAccount = raw.bankAccount;

    domain.serviceFeeRate = raw.serviceFeeRate;
    domain.serviceTypes = raw.serviceTypes;

    domain.isVat = raw.isVat;

    return domain;
  }
}
