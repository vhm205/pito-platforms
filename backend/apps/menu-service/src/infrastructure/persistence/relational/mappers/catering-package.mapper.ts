import {
  CateringPackage,
  CateringPackageOption,
} from 'apps/menu-service/src/domain/partner-item.domain';

import { CateringPackageOptionEntity } from '../entities/catering-package-option.entity';
import { CateringPackageEntity } from '../entities/catering-package.entity';

export class CateringPackageMapper {
  static toDomain(raw: CateringPackageEntity): CateringPackage {
    const domain = new CateringPackage();

    domain.id = raw.id;
    domain.name = raw.name;
    domain.isActive = raw.isActive;

    return domain;
  }
}

export class CateringPackageOptionMapper {
  static toDomain(raw: CateringPackageOptionEntity): CateringPackageOption {
    const domain = new CateringPackageOption();

    domain.id = raw.id;
    domain.name = raw.name;
    domain.status = raw.status;
    domain.packageId = raw.packageId;

    return domain;
  }
}
