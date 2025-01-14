import { NullableType } from '@app/common/types/common';

import { CateringPackage, CateringPackageOption } from '../../domain/partner-item.domain';

export abstract class CateringPackageRepository {
  // Catering Package
  abstract createCateringPackage(
    cateringPackage: Omit<CateringPackage, 'id' | 'options'>,
  ): Promise<number>;

  abstract updateCateringPackage(
    id: number,
    data: Partial<Omit<CateringPackage, 'id' | 'options'>>,
  ): Promise<{ affected: number }>;

  abstract deleteCateringPackage(cateringPackageId: number): Promise<boolean>;

  abstract findCateringPackageById(id: number): Promise<NullableType<CateringPackage>>;

  // Catering Package Option
  abstract createCateringPackageOption(
    option: Omit<CateringPackageOption, 'id' | 'packages'>,
  ): Promise<number>;

  abstract updateCateringPackageOption(
    optionId: number,
    data: Partial<Omit<CateringPackageOption, 'id'>>,
  ): Promise<{ affected: number }>;

  abstract deleteCateringPackageOption(optionId: number): Promise<boolean>;

  abstract findCateringPackageOptionsByPackageId(id: number): Promise<CateringPackageOption[]>;

  abstract findAllCateringPackageOptions(): Promise<CateringPackageOption[]>;
}
