import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdatePartnerStatusRequestDto } from './dtos/update-partner-status.dto';
import { PartnersService } from './partners.service';

@ApiTags('Partner')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnerService: PartnersService) {}

  @Patch(':identifier/status')
  @HttpCode(HttpStatus.OK)
  async updatePartnerStatus(@Body() body: UpdatePartnerStatusRequestDto) {
    const result = await this.partnerService.updatePartnerStatusByIds({
      ids: body.ids,
      status: body.status,
    });
    return result;
  }
}
