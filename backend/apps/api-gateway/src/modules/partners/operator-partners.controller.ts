import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, Auth } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import {
  OnboardingDto,
  OperatorQueryOnboardingDto,
  UpdateOnboardingStatusDto,
} from '@gateway/modules/partners/dto/onboarding.dto';
import { emptyPaginationResponse } from '@gateway/utils/common';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { isEmpty } from 'lodash';

import { PartnerDetailDto } from './dto/partner-detail.dto';
import { PartnerListDto, QueryPartnerListDto } from './dto/partner-list.dto';
import { UpdatePartnerRequestDto, UpdatePartnerResponseDto } from './dto/update-partner.dto';
import { OperatorPartnersService } from './operator-partners.service';

@Controller('operator')
export class OperatorPartnersController {
  constructor(private readonly service: OperatorPartnersService) {}

  @Get('partners')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: PartnerListDto })
  async getPartners(@Query() query: QueryPartnerListDto) {
    return this.service.getListPartners(query);
  }

  @Get('partners/:id')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: PartnerDetailDto })
  async getPartnerDetails(@Param('id') id: string) {
    const partner = await this.service.getPartnerDetails(id);
    return plainToInstance(PartnerDetailDto, partner);
  }

  @Patch('partners/:identifier')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: UpdatePartnerResponseDto })
  async updatePartnerById(
    @Param('identifier') identifier: string,
    @Body() body: UpdatePartnerRequestDto,
  ) {
    const result = await this.service.updatePartnerById({ id: identifier, ...body });
    return result;
  }

  @Get('/onboardings')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find onboardings with pagination' })
  @ApiPageWrapperResponse({ type: OnboardingDto, description: 'Find onboardings with pagination' })
  async findOnboardingsWithPagination(@Query() query: OperatorQueryOnboardingDto) {
    query.filters = query.filters.map(filter => filter);

    const { onboardings, totalCount } = await this.service.findOnboardingsWithPagination(query);

    if (isEmpty(onboardings)) {
      return emptyPaginationResponse({
        page: query.page,
        pageSize: query.pageSize,
        totalCount,
      });
    }

    const transformed = plainToInstance(OnboardingDto, onboardings, {
      excludeExtraneousValues: true,
    });

    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto<OnboardingDto>(transformed, pageMeta);
  }

  @Patch('/onboardings/status/:id')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update onboarding status' })
  @ApiWrapperResponse({
    type: UpdatePartnerResponseDto,
    description: 'Update onboarding status',
  })
  async updateOnboardingStatus(@Param('id') id: string, @Body() body: UpdateOnboardingStatusDto) {
    const result = await this.service.updateOnboardingStatus({ id, ...body });
    return result;
  }
}
