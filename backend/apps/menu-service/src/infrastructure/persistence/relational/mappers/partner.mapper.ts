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

  static toPersistence(domain: Partner): PartnerEntity {
    const entity = new PartnerEntity();

    entity.id = domain.id;
    entity.name = domain.name;
    entity.status = domain.status;
    entity.businessType = domain.businessType;
    entity.certification = domain.certification;
    entity.businessInfo = domain.businessInfo;
    entity.businessOwner = domain.businessOwner;
    entity.bankAccount = domain.bankAccount;
    if (domain.createdAt) entity.createdAt = domain.createdAt;
    if (domain.updatedAt) entity.updatedAt = domain.updatedAt;

    entity.serviceFeeRate = domain.serviceFeeRate;
    entity.serviceTypes = domain.serviceTypes;
    entity.isVat = domain.isVat;

    return entity;
  }
}
