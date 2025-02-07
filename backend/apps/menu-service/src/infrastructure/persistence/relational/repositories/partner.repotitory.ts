import { PARTNER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Onboarding } from 'apps/menu-service/src/domain/onboarding.domain';
import { Partner } from 'apps/menu-service/src/domain/partner.domain';
import { UpdatePartnerDto } from 'apps/menu-service/src/dtos/update-partner.dto';
import { PartnerOnboardingEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-onboarding.entity';
import { OnboardingMapper } from 'apps/menu-service/src/infrastructure/persistence/relational/mappers/onboarding.mapper';
import { FindOperator, Repository } from 'typeorm';

import { PartnerRepository } from '../../partner.repository';
import { PartnerEntity } from '../entities/partner.entity';
import { PartnerMapper } from '../mappers/partner.mapper';

@Injectable()
export class PartnerRelationalRepository implements PartnerRepository {
  constructor(
    @InjectRepository(PartnerEntity, PARTNER_DB_SOURCE)
    private partnerRepository: Repository<PartnerEntity>,

    @InjectRepository(PartnerOnboardingEntity, PARTNER_DB_SOURCE)
    private onboardingRepository: Repository<PartnerOnboardingEntity>,
  ) {}

  async findPartners(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Partner[], number]> {
    const { pagination, sorts, filters } = options;

    const [entities, total] = await this.partnerRepository.findAndCount({
      skip: (pagination.currentPage - 1) * pagination.pageSize, // 1-based index
      take: pagination.pageSize,
      where: filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
      order: Object.fromEntries(sorts.map(sort => [sort.column, sort.direction])),
    });

    const domainEntities = entities.map(PartnerMapper.toDomain);
    return [domainEntities, total];
  }

  async findPartnerById(id: string): Promise<NullableType<Partner>> {
    const entity = await this.partnerRepository.findOneBy({ id });
    return entity ? PartnerMapper.toDomain(entity) : null;
  }

  async updatePartner(id: string, data: UpdatePartnerDto): Promise<{ affectedRows: number }> {
    const partnerEntity = await this.partnerRepository.findOneBy({ id });
    if (!partnerEntity) {
      return { affectedRows: 0 };
    }
    const partnerDomain = PartnerMapper.toDomain(partnerEntity);
    const dataUpdate = PartnerMapper.toPersistence({ ...partnerDomain, ...data });

    const { affected } = await this.partnerRepository.update(id, dataUpdate);
    return { affectedRows: affected ?? 0 };
  }

  async findOnboardingsWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Onboarding[], number]> {
    const { pagination, sorts, filters } = options;

    const query = this.onboardingRepository.createQueryBuilder('onboarding');

    filters.forEach(filter => {
      for (const key in filter) {
        if (key === 'businessName') {
          query.andWhere(
            `onboarding.raw_business_metadata ->> 'business_name' ILIKE :business_name`,
            {
              business_name: filter[key].value,
            },
          );
        } else {
          query.andWhere({ [key]: filter[key] });
        }
      }
    });

    if (sorts && sorts.length > 0) {
      const order = Object.fromEntries(
        sorts.map(sort => [sort.column, sort.direction as 'ASC' | 'DESC']),
      );
      const snakeCaseOrder = Object.fromEntries(
        Object.entries(order).map(([key, value]) => [
          key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(),
          value,
        ]),
      );
      query.orderBy(snakeCaseOrder);
    }

    query.skip((pagination.currentPage - 1) * pagination.pageSize);
    query.take(pagination.pageSize);

    const [entities, total] = await query.getManyAndCount();

    const domainEntities = entities.map(entity => OnboardingMapper.toDomain(entity));

    return [domainEntities, total];
  }
}
