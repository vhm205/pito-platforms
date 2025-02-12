import { UpdateOnboardingStatusRequest } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Onboarding } from 'apps/menu-service/src/domain/onboarding.domain';
import { FindOperator } from 'typeorm';

import { Partner } from '../../domain/partner.domain';
import { UpdatePartnerDto } from '../../dtos/update-partner.dto';

export abstract class PartnerRepository {
  abstract findPartners(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Partner[], number]>;

  abstract findPartnerById(id: string): Promise<NullableType<Partner>>;

  abstract updatePartner(id: string, data: UpdatePartnerDto): Promise<{ affectedRows: number }>;

  abstract findOnboardingsWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Onboarding[], number]>;

  abstract updateOnboardingStatus(request: UpdateOnboardingStatusRequest): Promise<{
    affectedRows: number;
  }>;
}
