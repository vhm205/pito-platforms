import {
  GetItemInStoreRequest,
  GetStoreByFilterRequest,
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { timeout, firstValueFrom } from 'rxjs';

@Injectable()
export class StoresService {
  private menuService: MenusServiceClient;

  constructor(@Inject(MENU_SERVICE) private client: ClientGrpc) {
    this.menuService = this.client.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  searchStores(params: GetStoreByFilterRequest) {
    const source$ = this.menuService.findStoresByFilter(params).pipe(timeout(2000));
    return firstValueFrom(source$);
  }

  getItemsInStore(params: GetItemInStoreRequest) {
    const source$ = this.menuService.findItemsInStore(params).pipe(timeout(2000));
    return firstValueFrom(source$);
  }

  getFilterOptions(keyword: string) {
    const source$ = this.menuService.getFilterOptions({ keyword }).pipe(timeout(2000));
    return firstValueFrom(source$);
  }
}
