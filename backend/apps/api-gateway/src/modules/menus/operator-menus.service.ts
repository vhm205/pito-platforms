import { MENU_SERVICE, MENUS_SERVICE_NAME, MenusServiceClient } from '@app/common';
import { OperatorQueryItemDto } from '@gateway/modules/menus/dtos/query-menu.dto';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

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
      }),
    );
  }

  async findStore(id: string) {
    return firstValueFrom(this.menusServiceClient.findStore({ id }));
  }
}
