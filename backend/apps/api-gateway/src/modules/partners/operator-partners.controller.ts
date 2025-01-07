import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, Auth } from '@gateway/decorators';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { PartnerListDto, QueryPartnerListDto } from './dto/partner-list.dto';
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
}
