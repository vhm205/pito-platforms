import {
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  UpdatePartnerStatusRequest,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class PartnersService implements OnModuleInit {
  private menuServiceClient: MenusServiceClient;

  constructor(@Inject(MENU_SERVICE) private readonly menuClient: ClientGrpc) {}

  onModuleInit() {
    this.menuServiceClient = this.menuClient.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  updatePartnerStatusByIds(request: UpdatePartnerStatusRequest) {
    const source$ = this.menuServiceClient.updatePartnerStatus(request).pipe(timeout(2000));
    return firstValueFrom(source$);
  }
}
