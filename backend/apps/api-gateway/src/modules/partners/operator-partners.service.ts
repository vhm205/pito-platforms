import { MENU_SERVICE, MENUS_SERVICE_NAME, MenusServiceClient } from '@app/common';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { emptyPaginationResponse } from '@gateway/utils/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { isEmpty } from 'lodash';
import { firstValueFrom } from 'rxjs';

import { PartnerListDto, QueryPartnerListDto } from './dto/partner-list.dto';

@Injectable()
export class OperatorPartnersService implements OnModuleInit {
  private menuServiceClient: MenusServiceClient;

  constructor(@Inject(MENU_SERVICE) private readonly menuClient: ClientGrpc) {}

  onModuleInit() {
    this.menuServiceClient = this.menuClient.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  async getListPartners(query: QueryPartnerListDto) {
    const { partners, totalCount } = await firstValueFrom(
      this.menuServiceClient.getListPartners({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: query.sorts,
      }),
    );

    if (isEmpty(partners)) {
      return emptyPaginationResponse({
        page: query.page,
        pageSize: query.pageSize,
        totalCount,
      });
    }

    const transformedPartners = plainToInstance(PartnerListDto, partners);
    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto<PartnerListDto>(transformedPartners, pageMeta);
  }

  async getPartnerDetails(id: string) {
    return id;
  }
}
