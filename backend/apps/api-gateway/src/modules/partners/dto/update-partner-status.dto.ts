import { PartnerStatus } from '@app/common/enums/partner';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUUID } from 'class-validator';

const PartnerStatusUpdate = [PartnerStatus.STOP_COOPERATION, PartnerStatus.SUSPEND];

export class UpdatePartnerStatusRequestDto {
  @ApiProperty()
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];

  @ApiProperty({
    type: 'string',
    enum: PartnerStatusUpdate,
    example: PartnerStatus.SUSPEND,
  })
  @IsEnum(PartnerStatusUpdate)
  status: PartnerStatus;
}
