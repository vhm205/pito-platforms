import {
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  UpdatePartnerStatusRequest,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { timeout, firstValueFrom } from 'rxjs';

@Injectable()
export class PartnersService {
  private menuService: MenusServiceClient;

  constructor(@Inject(MENU_SERVICE) private client: ClientGrpc) {
    this.menuService = this.client.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  updatePartnerStatusByIds(request: UpdatePartnerStatusRequest) {
    const source$ = this.menuService.updatePartnerStatus(request).pipe(timeout(2000));
    return firstValueFrom(source$);
  }
}
