import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { FindOperator } from 'typeorm';

import { Partner } from '../../domain/partner.domain';

export abstract class PartnerRepository {
  abstract findPartners(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Partner[], number]>;

  abstract findPartnerById(id: string): Promise<NullableType<Partner>>;
}
