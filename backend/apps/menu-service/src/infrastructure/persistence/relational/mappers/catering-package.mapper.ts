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

    if (raw.options) {
      domain.options = raw.options.map(CateringPackageOptionMapper.toDomain);
    }

    return domain;
  }
}

export class CateringPackageOptionMapper {
  static toDomain(raw: CateringPackageOptionEntity): CateringPackageOption {
    const domain = new CateringPackageOption();

    domain.id = raw.id;
    domain.name = raw.name;
    domain.status = raw.status;

    if (raw.packages) {
      domain.packages = raw.packages.map(CateringPackageMapper.toDomain);
    }

    return domain;
  }
}
