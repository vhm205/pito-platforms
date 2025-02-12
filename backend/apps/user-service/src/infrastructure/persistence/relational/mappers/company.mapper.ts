import { Company } from 'apps/user-service/src/domain/company.domain';

import { CompanyEntity } from '../entities/company.entity';

export class CompanyMapper {
  static toDomain(raw: CompanyEntity): Company {
    const domain = new Company();

    domain.id = raw.id;
    domain.name = raw.name;
    domain.email = raw.email;
    domain.phone = raw.phone ?? '';
    domain.address = raw.address ?? '';
    domain.taxCode = raw.taxCode ?? '';
    domain.createdAt = raw.createdAt;

    if (raw.updatedAt) domain.updatedAt = raw.updatedAt;

    return domain;
  }
}
