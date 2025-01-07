import { Controller, Body, Patch, HttpCode, HttpStatus } from '@nestjs/common';

import { UpdatePartnerStatusRequestDto } from './dto/update-partner-status.dto';
import { PartnersService } from './partner.service';

@Controller('partners')
export class PartnersController {
  constructor(private readonly service: PartnersService) {}

  @Patch('status')
  @HttpCode(HttpStatus.OK)
  async updatePartnerStatus(@Body() body: UpdatePartnerStatusRequestDto) {
    const result = await this.service.updatePartnerStatusByIds({
      ids: body.ids,
      status: body.status,
    });
    return result;
  }
}
