import { Onboarding } from 'apps/menu-service/src/domain/onboarding.domain';

export class OnboardingMapper {
  static toDomain(raw: any): Onboarding {
    const domain = new Onboarding();

    domain.id = raw.id;
    domain.status = raw.status;
    domain.emailConfirmation = raw.emailConfirmation;
    domain.partnerType = raw.partnerType;
    domain.rawOwnerMetadata = raw.rawOwnerMetadata;
    domain.rawBusinessMetadata = raw.rawBusinessMetadata;
    domain.rawBankAccountMetadata = raw.rawBankAccountMetadata;
    domain.metadata = raw.metadata;
    domain.createdAt = raw.createdAt;
    if (raw.updatedAt) domain.updatedAt = raw.updatedAt;

    return domain;
  }

  static toPersistence(domainEntity: Onboarding): any {
    const entity: any = {};

    entity.id = domainEntity.id;
    entity.status = domainEntity.status;
    entity.emailConfirmation = domainEntity.emailConfirmation;
    entity.partnerType = domainEntity.partnerType;
    entity.rawOwnerMetadata = domainEntity.rawOwnerMetadata;
    entity.rawBusinessMetadata = domainEntity.rawBusinessMetadata;
    entity.rawBankAccountMetadata = domainEntity.rawBankAccountMetadata;
    entity.metadata = domainEntity.metadata;
    entity.createdAt = domainEntity.createdAt;
    if (domainEntity.updatedAt) entity.updatedAt = domainEntity.updatedAt;

    return entity;
  }
}
