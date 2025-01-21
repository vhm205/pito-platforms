import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, Auth } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

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
}
