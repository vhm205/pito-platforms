import {
  BulkUpdateItemsStatusRequest,
  PARTNER_DB_SOURCE,
  PartnerItemRequest,
  UpdateItemRequest,
} from '@app/common';
import { SourceSystemType, StoreStatus } from '@app/common/enums';
import { ItemStatus, PackagingType, UnitType } from '@app/common/enums/item';
import { MenuType } from '@app/common/enums/menu';
import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PartnerItem,
  CateringPackage,
  OccasionEvent,
} from 'apps/menu-service/src/domain/partner-item.domain';
import { SearchItemsInStoreResult } from 'apps/menu-service/src/dtos/search-items-in-store.dto';
import { PartnerItemRepository } from 'apps/menu-service/src/infrastructure/persistence/partner-item.repository';
import { MenuEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/menu.entity';
import { PartnerCategoryEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-category.entity';
import { PartnerItemEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-item.entity';
import { PartnerMenuCategoriesEntity } from 'apps/menu-service/src/infrastructure/persistence/relational/entities/partner-menu-category.entity';
import { PartnerItemMapper } from 'apps/menu-service/src/infrastructure/persistence/relational/mappers/partner-item.mapper';
import { forEach, isEmpty, map, size, toNumber } from 'lodash';
import {
  FindOperator,
  In,
  type ObjectLiteral,
  type FindOptionsWhere,
  type Repository,
} from 'typeorm';

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

    @InjectRepository(MenuEntity, PARTNER_DB_SOURCE)
    private menuRepository: Repository<MenuEntity>,

    @InjectRepository(PartnerCategoryEntity, PARTNER_DB_SOURCE)
    private partnerCategoryRepository: Repository<PartnerCategoryEntity>,
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

  async findItemCountsByStoreIds(
    storeIds: string[],
    serviceCategory?: string,
    shouldFetchPendingItems = false,
  ): Promise<{ storeId: string; itemCount: number; menuStatus: string }[]> {
    const query = `
      SELECT 
        store_id,
        COUNT(*) AS item_count,
        CASE 
          WHEN COUNT(*) FILTER (WHERE status = 'pending_approval') > 0 THEN 'pending_approval'
          ELSE 'active'
        END AS menu_status
      FROM items
      WHERE store_id = ANY($1)
      ${serviceCategory ? 'AND service_category = $2' : ''}
      ${shouldFetchPendingItems ? "AND status = 'pending_approval'" : ''}
      GROUP BY store_id;
    `;

    const params = serviceCategory ? [storeIds, serviceCategory] : [storeIds];

    const result = await this.partnerItemRepository.query(query, params);

    return result.map((row: { store_id: string; item_count: string; menu_status: string }) => ({
      storeId: row.store_id,
      itemCount: parseInt(row.item_count, 10),
      menuStatus: row.menu_status,
    }));
  }

  async findStoreIdsForPendingItems(serviceCategory?: string): Promise<{ storeIds: string[] }> {
    const query = `
      SELECT DISTINCT store_id
      FROM items
      WHERE status = 'pending_approval'
      ${serviceCategory ? 'AND service_category = $1' : ''};
    `;

    const params = serviceCategory ? [serviceCategory] : [];
    const result = await this.partnerItemRepository.query(query, params);
    return { storeIds: result.map((row: { store_id: string }) => row.store_id) };
  }

  async bulkInsertItems(
    items: Array<
      PartnerItemRequest & {
        slug: PartnerItemEntity['slug'];
        cateringPackages: PartnerItemEntity['cateringPackages'];
      }
    >,
  ) {
    const entities = items.map(item => ({
      ...item,
      packagingUnit: item?.packagingUnit as UnitType,
      packagingType: item?.packagingType as PackagingType,
      specialDietaries: item?.specialDietaries ?? [],
      status: (item?.status as ItemStatus) ?? ItemStatus.DRAFT,
      metadata: {
        has_notes: item?.metadata?.hasNotes,
        has_utensils: item?.metadata?.hasUtensils,
        rejection_reason: item?.metadata?.rejectionReason,
        dining_tools: item?.metadata?.diningTools,
        has_feeding_service: item?.metadata?.hasFeedingService,
      },
      serviceSettings: {
        setup_time: item?.serviceSettings?.setupTime ?? 0,
        service_person: item?.serviceSettings?.servicePerson ?? 0,
        service_time: item?.serviceSettings?.serviceTime ?? 0,
      },
      optionsChoices:
        item?.optionsChoices?.map(option => ({
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
    }));

    const insertedItems = await this.partnerItemRepository.save(entities);
    return insertedItems.map(PartnerItemMapper.toDomain);
  }

  async findMenuByStoreAndSystemType({
    storeId,
    systemType,
  }: {
    storeId: string;
    systemType: SourceSystemType;
  }): Promise<NullableType<MenuEntity>> {
    const queryBuilder = this.menuRepository.createQueryBuilder('menu');
    queryBuilder.where('menu.store_id = :storeId', { storeId });
    queryBuilder.andWhere('menu.type = :type', { type: systemType });
    const menu = await queryBuilder.getOne();
    return menu;
  }

  async findOrCreateMenuCategory({
    menuId,
    categoryId,
    packageId,
  }: {
    menuId: string;
    categoryId: NullableType<string>;
    packageId: NullableType<string>;
  }): Promise<string> {
    const matchObject: FindOptionsWhere<PartnerMenuCategoriesEntity> = { menuId };
    if (categoryId !== null) matchObject.categoryId = categoryId;
    if (packageId !== null) matchObject.packageId = +packageId;

    const existingCategory = await this.partnerMenuCategoriesRepository.findOne({
      where: matchObject,
    });

    if (existingCategory) {
      return existingCategory.id;
    }

    const newMenuCategoryPayload: Partial<PartnerMenuCategoriesEntity> = {
      menuId,
      categoryId,
      packageId: packageId ? +packageId : null,
    };

    if (categoryId !== null) newMenuCategoryPayload.type = MenuType.INDIVIDUAL;
    if (packageId !== null) newMenuCategoryPayload.type = MenuType.SET;

    const newMenuCategory = this.partnerMenuCategoriesRepository.create(newMenuCategoryPayload);
    const savedCategory = await this.partnerMenuCategoriesRepository.save(newMenuCategory);

    return savedCategory.id;
  }

  async fuzzySearchByName<T extends ObjectLiteral>({
    table,
    name,
  }: {
    table: string;
    name: string;
  }): Promise<T[]> {
    let repository: Repository<T>;

    switch (table) {
      case 'catering_packages':
        repository = this.cateringPackageRepository as unknown as Repository<T>;
        break;
      case 'categories':
        repository = this.partnerCategoryRepository as unknown as Repository<T>;
        break;
      default:
        throw new Error('Invalid repository name');
    }

    return repository
      .createQueryBuilder('item')
      .where('item.name ILIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async searchItemsInStore(params: {
    storeId: string;
    budgetMin?: number;
    budgetMax?: number;
    occasionEventIds?: number[];
    specialDietaryIds?: number[];
    serviceTypeIds?: number[];
    cuisineTypeIds?: number[];
    searchTerm?: string;
    sortBy?: string;
    page?: number;
    pageSize?: number;
  }): Promise<[SearchItemsInStoreResult[], number]> {
    const {
      storeId,
      budgetMin,
      budgetMax,
      occasionEventIds,
      specialDietaryIds,
      serviceTypeIds,
      cuisineTypeIds,
      searchTerm,
      sortBy,
      page = 1,
      pageSize = 10,
    } = params;

    const queryBuilder = this.partnerItemRepository
      .createQueryBuilder('i')
      .where('i.store_id = :storeId', { storeId });

    if (budgetMin) {
      queryBuilder.andWhere('i.base_price >= :budgetMin', { budgetMin });
    }

    if (budgetMax) {
      queryBuilder.andWhere('i.base_price <= :budgetMax', { budgetMax });
    }

    if (occasionEventIds?.length) {
      queryBuilder.andWhere('i.occasion_events @> :occasionEventIds', {
        occasionEventIds: JSON.stringify(occasionEventIds),
      });
    }

    if (specialDietaryIds?.length) {
      queryBuilder.andWhere('i.special_dietaries @> :specialDietaryIds', {
        specialDietaryIds: JSON.stringify(specialDietaryIds),
      });
    }

    if (serviceTypeIds?.length) {
      queryBuilder.andWhere('i.service_types @> :serviceTypeIds', {
        serviceTypeIds: JSON.stringify(serviceTypeIds),
      });
    }

    if (cuisineTypeIds?.length) {
      queryBuilder.andWhere('i.cuisine_types @> :cuisineTypeIds', {
        cuisineTypeIds: JSON.stringify(cuisineTypeIds),
      });
    }

    // Add subqueries for related data
    queryBuilder
      .addSelect(subQuery => {
        return subQuery
          .select(
            "jsonb_agg(jsonb_build_object('id', sd.id, 'name', sd.name))",
            'special_dietaries',
          )
          .from('special_dietaries', 'sd')
          .where('sd.id = ANY(i.special_dietaries)');
      }, 'special_dietaries')
      .addSelect(subQuery => {
        return subQuery
          .select("jsonb_agg(jsonb_build_object('id', ct.id, 'name', ct.name))", 'cuisine_types')
          .from('cuisine_types', 'ct')
          .where('ct.id = ANY(i.cuisine_types)');
      }, 'cuisine_types')
      .addSelect(subQuery => {
        return subQuery
          .select("jsonb_agg(jsonb_build_object('id', oe.id, 'name', oe.name))", 'occasion_events')
          .from('occasion_events', 'oe')
          .where('oe.id = ANY(i.occasion_events)');
      }, 'occasion_events');

    if (searchTerm) {
      queryBuilder
        .addSelect(
          `ts_rank(i.fts_vector, plainto_tsquery('english_nostop', lower(unaccent(:searchTermRank))))`,
          'search_rank',
        )
        .setParameter('searchTermRank', searchTerm)
        .orderBy('search_rank', 'DESC');
    }

    // Add sorting
    if (sortBy) {
      const [field, direction] = sortBy.split(':');
      queryBuilder.orderBy(`i.${field}`, direction?.toUpperCase() as 'ASC' | 'DESC');
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Add pagination
    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const items = await queryBuilder.getRawAndEntities();

    // Map the raw result to the desired format
    const data = items.entities.map((item, index) => {
      const raw = items.raw[index];
      const specialDietaries = raw.special_dietaries || [];
      const cuisineTypes = raw.cuisine_types || [];
      const occasionEvents = raw.occasion_events || [];

      return {
        item: {
          ...item,
          unitType: item.packagingUnit,
          unitQuantity: item.participant,
          eatingUtensil: item.metadata?.has_utensils,
          optionsAndChoices: item.optionsChoices?.map(opt => ({
            optionId: opt.id,
            name: opt.name,
            isRequired: opt.is_required,
            maxChoices: opt.max_choices,
            isMultipleChoice: opt.allow_multiple_selection,
            isSelectionQuantityAllowed: opt.allow_quantity_selection,
            choices: opt.choices?.map(choice => ({
              choiceId: choice.id,
              name: choice.name,
              basePrice: choice.price,
            })),
          })),
        },
        specialDietaries,
        cuisineTypes,
        occasionEvents,
      };
    });

    return [data as unknown as SearchItemsInStoreResult[], total];
  }

  async bulkUpdateItemsStatus(request: BulkUpdateItemsStatusRequest) {
    const { ids, status, rejectionReason } = request;
    if (!ids?.length) throw new Error('No item IDs provided');

    const updateData = { status: status as ItemStatus };

    if (status === ItemStatus.REJECTED) {
      const items = await this.partnerItemRepository.findByIds(ids);
      if (!items.length) throw new Error('No matching items found');

      const updatedItems = items?.map(item => ({
        id: item.id,
        metadata: {
          ...item.metadata,
          rejection_reason: rejectionReason,
        },
        status: ItemStatus.REJECTED,
      }));

      await this.partnerItemRepository.save(updatedItems);
    } else {
      const { affected } = await this.partnerItemRepository.update({ id: In(ids) }, updateData);
      return { affectedRows: affected ?? 0 };
    }

    return { affectedRows: ids.length };
  }

  async deleteItem(
    filter: FindOptionsWhere<Pick<PartnerItem, 'id' | 'slug'>>,
  ): Promise<{ affectedRows: number }> {
    const { affected } = await this.partnerItemRepository.delete(filter);
    return { affectedRows: affected ?? 0 };
  }
}
