import { GetListPartnersRequest, transformFilterRule } from '@app/common';
import { Injectable } from '@nestjs/common';

import { UpdatePartnerDto } from './dtos/update-partner.dto';
import { PartnerRepository } from './infrastructure/persistence/partner.repository';

@Injectable()
export class PartnerService {
  constructor(private partnerRepository: PartnerRepository) {}

  async getPartnersWithPagination({ filters, pagination, sorts }: GetListPartnersRequest) {
    return this.partnerRepository.findPartners({
      pagination: pagination!,
      filters: filters.map(transformFilterRule),
      sorts,
    });
  }

  async getPartnerDetails(id: string) {
    return this.partnerRepository.findPartnerById(id);
  }

  async updatePartner(id: string, data: UpdatePartnerDto) {
    if (data.serviceTypes && !data.serviceTypes.length) {
      delete data.serviceTypes;
    }

    return this.partnerRepository.updatePartner(id, data);
  }
}
