import { getImageUrl } from '@app/common';
import { Partner } from 'apps/user-service/src/domain/partner.domain';
import { UserPartner } from 'apps/user-service/src/domain/user-partner.domain';

import { PartnerEntity } from '../entities/partner.entity';
import { UserPartnerEntity } from '../entities/user-partner.entity';

export class PartnerMapper {
  static toDomain(raw: PartnerEntity): Partner {
    const domain = new Partner();

    domain.id = raw.id;
    domain.partnerName = raw.partnerName;
    domain.isActive = raw.isActive;
    domain.status = raw.status;
    domain.bankAccount = raw.bankAccount;
    domain.businessInfo = raw.businessInfo;
    domain.businessOwner = raw.businessOwner;
    domain.partnerType = raw.partnerType;
    domain.serviceTypes = raw.serviceTypes;
    domain.serviceFeeRate = raw.serviceFeeRate;
    domain.isVat = raw.isVat;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;

    return domain;
  }
}

export class UserPartnerMapper {
  static toDomain(raw: UserPartnerEntity): UserPartner {
    const domain = new UserPartner();

    domain.id = raw.id;
    domain.fullName = raw.fullName;
    domain.email = raw.email;
    domain.phone = raw.phone;
    domain.fcmToken = raw.fcmToken;
    domain.avatarUrl = raw.avatarUrl ? getImageUrl(raw.avatarUrl) : '';
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;

    return domain;
  }
}
