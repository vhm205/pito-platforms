import { PARTNER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CateringPackage,
  CateringPackageOption,
} from 'apps/menu-service/src/domain/partner-item.domain';
import { type Repository } from 'typeorm';

import { CateringPackageRepository } from '../../catering-package.repository';
import { CateringPackageOptionEntity } from '../entities/catering-package-option.entity';
import { CateringPackageEntity } from '../entities/catering-package.entity';
import {
  CateringPackageMapper,
  CateringPackageOptionMapper,
} from '../mappers/catering-package.mapper';

@Injectable()
export class CateringPackageRelationalRepository implements CateringPackageRepository {
  constructor(
    @InjectRepository(CateringPackageOptionEntity, PARTNER_DB_SOURCE)
    private cateringPackageOptionRepository: Repository<CateringPackageOptionEntity>,

    @InjectRepository(CateringPackageEntity, PARTNER_DB_SOURCE)
    private cateringPackageRepository: Repository<CateringPackageEntity>,
  ) {}

  // Catering Package
  async createCateringPackage(data: Omit<CateringPackage, 'id'>) {
    const newPackage = this.cateringPackageRepository.create(data);
    const result = await this.cateringPackageRepository.insert(newPackage);
    return result.identifiers[0]?.id;
  }

  async updateCateringPackage(id: number, data: Partial<Omit<CateringPackage, 'id'>>) {
    const result = await this.cateringPackageRepository.update({ id }, data);
    return { affected: result.affected || 0 };
  }

  async deleteCateringPackage(id: number) {
    const deleteResult = await this.cateringPackageRepository.delete(id);
    return (deleteResult.affected || 0) > 0;
  }

  async findCateringPackageById(id: number): Promise<NullableType<CateringPackage>> {
    const entity = await this.cateringPackageRepository.findOne({ where: { id } });
    return entity ? CateringPackageMapper.toDomain(entity) : null;
  }

  // Catering Package Option
  async createCateringPackageOption(data: Omit<CateringPackageOption, 'id'>) {
    const newOption = this.cateringPackageOptionRepository.create(data);
    const result = await this.cateringPackageOptionRepository.insert(newOption);
    return result.identifiers[0]?.id;
  }

  async updateCateringPackageOption(
    optionId: number,
    data: Partial<Omit<CateringPackageOption, 'id'>>,
  ) {
    const result = await this.cateringPackageOptionRepository.update({ id: optionId }, data);
    return { affected: result.affected || 0 };
  }

  async deleteCateringPackageOption(optionId: number) {
    const deleteResult = await this.cateringPackageOptionRepository.delete(optionId);
    return (deleteResult.affected || 0) > 0;
  }

  async findCateringPackageOptionsByPackageId(id: number): Promise<CateringPackageOption[]> {
    const options = await this.cateringPackageOptionRepository.findBy({ packageId: id });
    return options.map(CateringPackageOptionMapper.toDomain);
  }
}
