import { PARTNER_DB_SOURCE, PartnerItemRequest, UpdateItemRequest } from '@app/common';
import { ItemStatus, PackagingType, UnitType } from '@app/common/enums/item';
import { MenuType } from '@app/common/enums/menu';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CateringPackage } from 'apps/menu-service/src/domain/catering-package.domain';
import { PartnerItem } from 'apps/menu-service/src/domain/partner-item.domain';
import { PartnerItemRepository } from 'apps/menu-service/src/infrastructure/persistence/partner-item.repository';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import { PartnerItemMapper } from 'apps/menu-service/src/infrastructure/persistence/relational/mappers/partner-item.mapper';
import { FindOperator, In, type FindOptionsWhere, type Repository } from 'typeorm';

import { CateringPackageEntity } from '../entities/catering-package.entity';
import { StoreServiceEntity } from '../entities/store-service.entity';

@Injectable()
export class PartnerItemRelationalRepository implements PartnerItemRepository {
  constructor(
    @InjectRepository(PartnerItemEntity, PARTNER_DB_SOURCE)
    private partnerItemRepository: Repository<PartnerItemEntity>,

    @InjectRepository(PartnerMenuCategoriesEntity, PARTNER_DB_SOURCE)
    private partnerMenuCategoriesRepository: Repository<PartnerMenuCategoriesEntity>,

    @InjectRepository(CateringPackageEntity, PARTNER_DB_SOURCE)
    private cateringPackageRepository: Repository<CateringPackageEntity>,

    @InjectRepository(StoreServiceEntity, PARTNER_DB_SOURCE)
    private storeServiceRepository: Repository<StoreServiceEntity>,
  ) {}

  async insertItem(
    payload: PartnerItemRequest & {
      slug: PartnerItemEntity['slug'];
      cateringPackages: PartnerItemEntity['cateringPackages'];
    },
  ) {
    const insertedItem = await this.partnerItemRepository.save({
      ...payload,
      packagingUnit: payload?.packagingUnit as UnitType,
      packagingType: payload?.packagingType as PackagingType,
      specialDietaries: payload?.specialDietaries ?? [],
      status: (payload?.status as ItemStatus) ?? ItemStatus.DRAFT,
      metadata: {
        has_notes: payload.metadata?.hasNotes,
        has_utensils: payload.metadata?.hasUtensils,
        rejection_reason: payload.metadata?.rejectionReason,
      },
      serviceSettings: {
        setup_time: payload?.serviceSettings?.setupTime ?? 0,
        service_person: payload?.serviceSettings?.servicePerson ?? 0,
        service_time: payload?.serviceSettings?.serviceTime ?? 0,
      },
      optionsChoices:
        payload?.optionsChoices?.map(option => ({
          id: option?.id,
          name: option?.name,
          description: option?.description,
          allow_multiple_selection: option?.allowMultipleSelection ?? false,
          allow_quantity_selection: option?.allowQuantitySelection ?? false,
          is_required: option?.isRequired ?? false,
          max_choices: option?.maxChoices ?? 0,
          type: option?.type,
          max_quantity: option?.maxQuantity,
          choices: option?.choices?.map(choice => ({
            id: choice?.id,
            name: choice?.name,
            price: choice?.price,
          })),
        })) ?? [],
    });

    return PartnerItemMapper.toDomain(insertedItem);
  }

  async getMenuCategoryById(id: string) {
    return this.partnerMenuCategoriesRepository.findOne({
      where: { id },
    });
  }

  async findOne(filter: FindOptionsWhere<Pick<PartnerItemEntity, 'id' | 'slug'>>) {
    const item = await this.partnerItemRepository.findOne({ where: filter });
    return item ? PartnerItemMapper.toDomain(item) : null;
  }

  async updateItem(payload: UpdateItemRequest) {
    const { id, updateItemRequest } = payload;

    const updatedItem = await this.partnerItemRepository.save({
      id,
      ...updateItemRequest,
      packagingUnit: updateItemRequest?.packagingUnit as UnitType,
      packagingType: updateItemRequest?.packagingType as PackagingType,
      status: (updateItemRequest?.status as ItemStatus) ?? ItemStatus.DRAFT,
      metadata: {
        has_notes: updateItemRequest?.metadata?.hasNotes,
        has_utensils: updateItemRequest?.metadata?.hasUtensils,
        rejection_reason: updateItemRequest?.metadata?.rejectionReason,
      },
      serviceSettings: {
        setup_time: updateItemRequest?.serviceSettings?.setupTime,
        service_person: updateItemRequest?.serviceSettings?.servicePerson,
        service_time: updateItemRequest?.serviceSettings?.serviceTime,
      },
      optionsChoices:
        updateItemRequest?.optionsChoices?.map(option => ({
          id: option?.id,
          name: option?.name,
          description: option?.description,
          allow_multiple_selection: option?.allowMultipleSelection ?? false,
          allow_quantity_selection: option?.allowQuantitySelection ?? false,
          is_required: option?.isRequired ?? false,
          max_choices: option?.maxChoices ?? 0,
          type: option?.type,
          max_quantity: option?.maxQuantity,
          choices: option?.choices?.map(choice => ({
            id: choice?.id,
            name: choice?.name,
            price: choice?.price,
          })),
        })) ?? [],
      orderDeadlineAt: updateItemRequest?.orderDeadlineAt || null,
    });

    return PartnerItemMapper.toDomain(updatedItem);
  }

  async findItemsWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }) {
    const { pagination, sorts, filters } = options;

    const [entities, total] = await this.partnerItemRepository.findAndCount({
      skip: (pagination.currentPage - 1) * pagination.pageSize,
      take: pagination.pageSize,
      where: {
        ...filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
      },
      order: Object.fromEntries(sorts.map(sort => [sort.column, sort.direction])),
    });

    const partnerItems = entities?.map(entity => PartnerItemMapper.toDomain(entity));

    return [partnerItems, total] as [PartnerItem[], number];
  }

  async findAllCateringPackages(): Promise<CateringPackage[]> {
    const packages = await this.cateringPackageRepository.find();
    return packages;
  }

  async findItemsByFilters(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
    latitude: number | undefined;
    longitude: number | undefined;
  }) {
    const { pagination, sorts, filters, latitude, longitude } = options;
    const skip = (pagination.currentPage - 1) * pagination.pageSize;
    const take = pagination.pageSize;

    const queryBuilder = this.partnerItemRepository
      .createQueryBuilder('item')
      .innerJoinAndSelect('item.store', 'store')
      .innerJoin('item.menuCategory', 'menuCategory', 'menuCategory.type = :menuType', {
        menuType: MenuType.SET,
      });

    /* WHERE clause */
    if (filters.length) {
      filters.forEach(filter => {
        queryBuilder.andWhere(filter);
      });
    }

    /* ORDER BY clause */
    if (latitude && longitude) {
      const distanceFormula = `
      6371 * acos(
        cos(radians(:userLatitude)) * cos(radians((store.location ->> 'latitude')::numeric)) *
        cos(radians((store.location ->> 'longitude')::numeric) - radians(:userLongitude)) +
        sin(radians(:userLatitude)) * sin(radians((store.location ->> 'latitude')::numeric))
      )`;

      queryBuilder.addSelect(distanceFormula, 'distance').setParameters({
        userLatitude: latitude,
        userLongitude: longitude,
      });
      queryBuilder.orderBy('distance', 'ASC');
    }

    if (sorts.length) {
      sorts.forEach(sort => {
        const column = `item.${sort.column}`;
        const direction = sort.direction === 'asc' ? 'ASC' : 'DESC';
        queryBuilder.addOrderBy(column, direction);
      });
    }

    /* LIMIT clause */
    queryBuilder.skip(skip);
    queryBuilder.take(take);

    const [total, { entities, raw }] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.getRawAndEntities(),
    ]);

    const storeIds = entities.map(item => item.store?.id);
    const storeServices = await this.storeServiceRepository.findBy({
      storeId: In(storeIds),
    });

    /* Transform */
    const transformedItems = entities.map((item, index) => {
      const { status, prepTimes } = item.store;
      const rawItem = raw[index];
      const service = storeServices.find(service => service.storeId === item.store.id);

      return {
        ...PartnerItemMapper.toDomain(item),
        store: {
          status: status as string,
          prepTimes: prepTimes as any,
          reopenTime: service?.reopenTime?.toString(),
        },
        distance: rawItem.distance,
      };
    });

    return {
      items: transformedItems,
      total,
    };
  }
}
