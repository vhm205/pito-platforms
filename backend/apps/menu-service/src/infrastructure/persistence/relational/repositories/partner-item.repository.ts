import { PARTNER_DB_SOURCE, PartnerItemRequest, UpdateItemRequest } from '@app/common';
import { StoreStatus } from '@app/common/enums';
import { ItemStatus, PackagingType, UnitType } from '@app/common/enums/item';
import { MenuType } from '@app/common/enums/menu';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PartnerItem,
  CateringPackage,
  OccasionEvent,
} from 'apps/menu-service/src/domain/partner-item.domain';
import { PartnerItemRepository } from 'apps/menu-service/src/infrastructure/persistence/partner-item.repository';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import { PartnerItemMapper } from 'apps/menu-service/src/infrastructure/persistence/relational/mappers/partner-item.mapper';
import { forEach, isEmpty, map, size, toNumber } from 'lodash';
import { FindOperator, In, type FindOptionsWhere, type Repository } from 'typeorm';

import { CateringPackageEntity } from '../entities/catering-package.entity';
import { PartnerOccasionEventEntity } from '../entities/partner-occasion-event.entity';
import { StoreServiceEntity } from '../entities/store-service.entity';
import { CateringPackageMapper } from '../mappers/catering-package.mapper';

@Injectable()
export class PartnerItemRelationalRepository implements PartnerItemRepository {
  constructor(
    @InjectRepository(PartnerItemEntity, PARTNER_DB_SOURCE)
    private partnerItemRepository: Repository<PartnerItemEntity>,

    @InjectRepository(PartnerMenuCategoriesEntity, PARTNER_DB_SOURCE)
    private partnerMenuCategoriesRepository: Repository<PartnerMenuCategoriesEntity>,

    @InjectRepository(PartnerOccasionEventEntity, PARTNER_DB_SOURCE)
    private occasionEventRepository: Repository<PartnerOccasionEventEntity>,

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
        has_notes: payload?.metadata?.hasNotes,
        has_utensils: payload?.metadata?.hasUtensils,
        rejection_reason: payload?.metadata?.rejectionReason,
        dining_tools: payload?.metadata?.diningTools,
        has_feeding_service: payload?.metadata?.hasFeedingService,
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
            quantity: choice?.quantity,
            quantity_unit: choice?.quantityUnit,
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

  async findOne(filter: FindOptionsWhere<Pick<PartnerItemEntity, 'id' | 'slug' | 'status'>>) {
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
        dining_tools: updateItemRequest?.metadata?.diningTools,
        has_feeding_service: updateItemRequest?.metadata?.hasFeedingService,
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
            quantity: choice?.quantity,
            quantity_unit: choice?.quantityUnit,
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
    exceptionFilters: Record<string, unknown>;
  }) {
    const { pagination, sorts, filters, exceptionFilters } = options;
    const { menuType } = exceptionFilters;
    const skip = (pagination.currentPage - 1) * pagination.pageSize;
    const take = pagination.pageSize;

    const queryBuilder = this.partnerItemRepository.createQueryBuilder('item');

    if (menuType) {
      queryBuilder.innerJoin('item.menuCategory', 'menuCategory', 'menuCategory.type = :menuType', {
        menuType: menuType || MenuType.SET,
      });
    }

    /* WHERE clause */
    if (filters.length) {
      filters.forEach(filter => {
        queryBuilder.andWhere(filter);
      });
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

    const [entities, total] = await queryBuilder.getManyAndCount();
    const partnerItems = entities?.map(entity => PartnerItemMapper.toDomain(entity));

    return [partnerItems, total] as [PartnerItem[], number];
  }

  async findAllCateringPackages(options: { sorts: SortRule[] }): Promise<CateringPackage[]> {
    const order = options.sorts.reduce(
      (acc, sort) => ({ ...acc, [sort.column]: sort.direction }),
      {},
    );
    const packages = await this.cateringPackageRepository.find({
      relations: {
        options: true,
      },
      order,
    });
    return packages.map(CateringPackageMapper.toDomain);
  }

  async findAllOccasionEvents(options: { sorts: SortRule[] }): Promise<OccasionEvent[]> {
    const order = options.sorts.reduce(
      (acc, sort) => ({ ...acc, [sort.column]: sort.direction }),
      {},
    );
    const occasionEvents = await this.occasionEventRepository.find({
      order,
    });
    return occasionEvents.map(occasionEvent => ({
      index: occasionEvent.index,
      id: occasionEvent.id,
      name: occasionEvent.name,
      isActive: occasionEvent.isActive,
    }));
  }

  async findItemsByFilters(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
    exceptionFilters: Record<string, unknown>;
  }) {
    const { pagination, sorts, filters, exceptionFilters } = options;
    const skip = (pagination.currentPage - 1) * pagination.pageSize;
    const take = pagination.pageSize;
    const { latitude, longitude, menuType } = exceptionFilters;

    const queryBuilder = this.partnerItemRepository
      .createQueryBuilder('item')
      .innerJoinAndSelect('item.store', 'store');

    if (menuType) {
      queryBuilder.innerJoin('item.menuCategory', 'menuCategory', 'menuCategory.type = :menuType', {
        menuType: menuType || MenuType.SET,
      });
    }

    /* WHERE clause */
    if (filters.length) {
      filters.forEach(filter => {
        queryBuilder.andWhere(filter);
      });
    }

    /* ORDER BY clause */
    queryBuilder
      .addSelect(
        `CASE store.status
        WHEN '${StoreStatus.ACTIVE}' THEN 1
        WHEN '${StoreStatus.NOT_ACCEPTING_ORDER}' THEN 2
        WHEN '${StoreStatus.TEMPORARILY_CLOSED}' THEN 3
        ELSE 4
      END`,
        'store_status_order',
      )
      .orderBy('store_status_order', 'ASC');

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
      queryBuilder.addOrderBy('distance', 'ASC');
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

  async filterItemsWithCateringPackage(args: {
    filters: Record<string, FindOperator<any>>[];
    pagination: PaginationRequest;
  }): Promise<[PartnerItem[], number]> {
    const { filters, pagination } = args;
    const FILTER_ITEM_MAP = {
      cateringPackage: 0,
      serviceType: 0,
      serviceCategory: '',
      status: '',
      menuPricePerPax: [],
    };

    const filterMap = filters.reduce((acc, f) => {
      if (f.cateringPackage) acc.cateringPackage = toNumber(f.cateringPackage.value);
      else if (f.serviceCategory) acc.serviceCategory = f.serviceCategory.value;
      else if (f.menuStatus) acc.status = f.menuStatus.value;
      else if (f.menuPricePerPax) acc.menuPricePerPax = f.menuPricePerPax.value.map(toNumber);
      return acc;
    }, FILTER_ITEM_MAP);

    const { cateringPackage, serviceCategory, serviceType, status, menuPricePerPax } = filterMap;

    const storesHavingCateringPackage = () =>
      this.partnerItemRepository
        .createQueryBuilder()
        .select('DISTINCT store_id')
        .where(`:cateringPackage = ANY(catering_packages)`, { cateringPackage })
        .orderBy('store_id');

    const [storeIds, total] = await Promise.all([
      storesHavingCateringPackage()
        .skip((pagination.currentPage - 1) * pagination.pageSize)
        .take(pagination.pageSize)
        .getRawMany(),
      storesHavingCateringPackage().getRawMany().then(size),
    ]);

    if (isEmpty(storeIds)) return [storeIds, storeIds.length];

    const queryBuilder = this.partnerItemRepository
      .createQueryBuilder()
      .select()
      .where('store_id IN (:...storeIds)', { storeIds: storeIds.map(({ store_id }) => store_id) })
      .andWhere(':cateringPackage = ANY(catering_packages)', { cateringPackage });

    if (status) {
      if (Array.isArray(status)) queryBuilder.andWhere(`status IN (:...status)`, { status });
      else queryBuilder.andWhere('status = :status', { status });
    }
    if (serviceCategory) {
      queryBuilder.andWhere(`service_category = :serviceCategory`, { serviceCategory });
    }
    if (serviceType) {
      queryBuilder.andWhere(`service_type = :serviceType`, { serviceType });
    }
    if (menuPricePerPax.length) {
      const [min, max] = menuPricePerPax;
      queryBuilder.andWhere(`base_price BETWEEN :min AND :max`, { min, max });
    }

    const itemEntities = await queryBuilder.orderBy('store_id').getMany();

    const domainEntities = map(itemEntities, PartnerItemMapper.toDomain);
    return [domainEntities, total];
  }

  async findItems(args: {
    filters: Record<string, FindOperator<unknown>>[];
  }): Promise<[PartnerItem[], number]> {
    const [entities, total] = await this.partnerItemRepository.findAndCount({
      where: args.filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
    });

    const domainEntities = entities.map(PartnerItemMapper.toDomain);
    return [domainEntities, total];
  }

  async countCateringPackagesItems(args: {
    serviceCategory: string;
    itemStatus: string[];
    cateringPackages: number[];
  }): Promise<Map<number, number>> {
    const query = `
      SELECT 
          cp.value AS catering_package,
          COUNT(*) AS item_count
      FROM (
          SELECT catering_packages
          FROM items
          WHERE 
              service_category = $1 AND
              status = ANY($2)
      ) i,
        UNNEST(i.catering_packages) AS cp(value)
      WHERE 
          cp.value = ANY($3)
      GROUP BY cp.value
      ORDER BY cp.value;
  `;

    const result = await this.partnerItemRepository.query(query, [
      args.serviceCategory,
      args.itemStatus,
      args.cateringPackages,
    ]);

    const resultMap = new Map<number, number>();
    forEach(result, ({ catering_package, item_count }) => {
      resultMap.set(toNumber(catering_package), toNumber(item_count));
    });

    return resultMap;
  }

  async findCateringPackages(args: {
    filters: Record<string, FindOperator<any>>[];
  }): Promise<CateringPackage[]> {
    const entities = await this.cateringPackageRepository.find({
      where: args.filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
    });
    return entities;
  }
}
