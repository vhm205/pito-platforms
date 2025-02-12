import {
  LoggerService,
  MENU_SERVICE,
  MENUS_SERVICE_NAME,
  MenusServiceClient,
  UpdateOnboardingStatusRequest,
  UpdatePartnerRequest,
} from '@app/common';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { OperatorQueryOnboardingDto } from '@gateway/modules/partners/dto/onboarding.dto';
import { emptyPaginationResponse } from '@gateway/utils/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { isEmpty } from 'lodash';
import { firstValueFrom, timeout } from 'rxjs';

import { PartnerListDto, QueryPartnerListDto } from './dto/partner-list.dto';

@Injectable()
export class OperatorPartnersService implements OnModuleInit {
  private menuServiceClient: MenusServiceClient;

  constructor(
    private readonly logger: LoggerService,
    @Inject(MENU_SERVICE) private readonly menuClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.menuServiceClient = this.menuClient.getService<MenusServiceClient>(MENUS_SERVICE_NAME);
  }

  async getListPartners(query: QueryPartnerListDto) {
    const { data, totalCount } = await firstValueFrom(
      this.menuServiceClient.getListPartners({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: query.sorts,
      }),
    );

    if (isEmpty(data)) {
      return emptyPaginationResponse({
        page: query.page,
        pageSize: query.pageSize,
        totalCount,
      });
    }

    const transformedPartners = plainToInstance(PartnerListDto, data);
    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto<PartnerListDto>(transformedPartners, pageMeta);
  }

  async getPartnerDetails(id: string) {
    const { data, error } = await firstValueFrom(this.menuServiceClient.getPartnerDetails({ id }));
    if (error) {
      this.logger.error(`Error while fetching partner details => ${error}`);
      throw new Error(error);
    }
    return data;
  }

  updatePartnerById(request: UpdatePartnerRequest) {
    const source$ = this.menuServiceClient.updatePartner(request).pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  async findOnboardingsWithPagination(query: OperatorQueryOnboardingDto) {
    return firstValueFrom(
      this.menuServiceClient.findOnboardingsWithPagination({
        filters: query.filters,
        pagination: { currentPage: query.page, pageSize: query.pageSize },
        sorts: query.sorts,
      }),
    );
  }

  async updateOnboardingStatus(request: UpdateOnboardingStatusRequest) {
    const source$ = this.menuServiceClient.updateOnboardingStatus(request).pipe(timeout(3000));
    return firstValueFrom(source$);
  }
}
