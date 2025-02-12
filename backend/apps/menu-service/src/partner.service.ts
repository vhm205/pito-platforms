import {
  FindOnboardingsRequest,
  GetListPartnersRequest,
  transformFilterRule,
  UpdateOnboardingStatusRequest,
} from '@app/common';
import { GrpcStatus } from '@app/common/enums';
import { OnboardingStatus } from '@app/common/enums/partner';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Onboarding } from 'apps/menu-service/src/domain/onboarding.domain';

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

  async findOnboardingsWithPagination({
    pagination,
    filters,
    sorts,
  }: FindOnboardingsRequest): Promise<[Onboarding[], number]> {
    return this.partnerRepository.findOnboardingsWithPagination({
      pagination: pagination!,
      filters: filters.map(transformFilterRule),
      sorts,
    });
  }

  async updateOnboardingStatus(request: UpdateOnboardingStatusRequest) {
    if (request.status === OnboardingStatus.REJECTED && !request.rejectionReason) {
      throw new RpcException({
        message: 'Rejection reason is required when status is reject',
        status: GrpcStatus.INVALID_ARGUMENT,
      });
    }

    return this.partnerRepository.updateOnboardingStatus(request);
  }
}
