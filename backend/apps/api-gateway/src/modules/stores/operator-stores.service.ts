import {
  LoggerService,
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  UpdateStoreRequest,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

import { QueryStoreListDto } from './dtos/store-list.dto';

@Injectable()
export class OperatorStoresService implements OnModuleInit {
  private menuServiceClient: MenusServiceClient;

  constructor(
    private readonly logger: LoggerService,
    @Inject(MENU_SERVICE) private readonly menuClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.menuServiceClient = this.menuClient.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  async getListStores(query: QueryStoreListDto) {
    return firstValueFrom(
      this.menuServiceClient.findStores({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: query.sorts,
      }),
    );
  }

  updateStoreById(request: UpdateStoreRequest) {
    const source$ = this.menuServiceClient.updateStore(request).pipe(timeout(3000));
    return firstValueFrom(source$);
  }
}
