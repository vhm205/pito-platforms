import {
  DEFAULT_PAGE_NUMBER,
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
} from '@app/common';
import { FilterRuleDto } from '@gateway/gateway-common/dto/query-dto';
import { OperatorQueryItemDto } from '@gateway/modules/menus/dtos/query-menu.dto';
import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { forEach, isEmpty, map } from 'lodash';
import { firstValueFrom } from 'rxjs';

import { OperatorQueryStoreItemDto } from './dtos/operator-query-store-item.dto';

@Injectable()
export class OperatorMenusService implements OnModuleInit {
  private menusServiceClient: MenusServiceClient;
  constructor(@Inject(MENU_SERVICE) private readonly menuClient: ClientGrpc) {}

  onModuleInit() {
    this.menusServiceClient = this.menuClient.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  async findItemsWithPagination(query: OperatorQueryItemDto) {
    return firstValueFrom(
      this.menusServiceClient.findItemsWithPagination({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: query.sorts,
        menuType: query.menuType,
      }),
    );
  }

  async findStore(id: string) {
    return firstValueFrom(this.menusServiceClient.findStore({ id }));
  }

  async getStoresAndItemsWithCateringPackage(query: OperatorQueryStoreItemDto) {
    const {
      data: items,
      totalCount,
      error,
    } = await firstValueFrom(
      this.menusServiceClient.filterItemsWithCateringPackage({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: [],
      }),
    );
    if (error) throw new InternalServerErrorException(error);
    if (isEmpty(items)) return { data: [], totalCount };

    const uniqueStoreIds = Array.from(new Set(map(items, i => i.storeId)));
    const validColumns = new Set(['storeName', 'storeStatus', 'engagementLevel']);

    const filtersStore = query.filters.reduce((res: FilterRuleDto[], f) => {
      if (validColumns.has(f.column)) {
        if (f.column === 'storeStatus') f.column = 'status';
        res.push(f);
      }
      return res;
    }, []);

    const stores = await firstValueFrom(
      this.menusServiceClient.findStores({
        filters: [
          { column: 'id', operator: 'in', value: uniqueStoreIds.join(',') },
          ...filtersStore,
        ],
        pagination: { currentPage: DEFAULT_PAGE_NUMBER, pageSize: uniqueStoreIds.length },
        sorts: [],
      }),
    ).then(r => r.stores ?? []);

    const storesMap = new Map<string, any>(map(stores, s => [s.id, { ...s, items: [] }]));
    forEach(items, i => {
      if (storesMap.has(i.storeId)) storesMap.get(i.storeId).items.push(i);
    });

    return { data: Array.from(storesMap.values()), totalCount };
  }
}
