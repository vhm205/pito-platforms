import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, Auth } from '@gateway/decorators';
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Query } from '@nestjs/common';

import { PartnerListDto, QueryPartnerListDto } from './dto/partner-list.dto';
import { UpdatePartnerStatusRequestDto } from './dto/update-partner-status.dto';
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

  @Patch('partners/:identifier/status')
  @HttpCode(HttpStatus.OK)
  async updatePartnerStatus(@Body() body: UpdatePartnerStatusRequestDto) {
    const result = await this.service.updatePartnerStatusByIds({
      ids: body.ids,
      status: body.status,
    });
    return result;
  }
}
