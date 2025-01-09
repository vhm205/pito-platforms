import { StoreStatus } from '@app/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUUID } from 'class-validator';

export class UpdateStoreStatusRequestDto {
  @ApiProperty()
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];

  @ApiProperty({
    type: 'string',
    enum: StoreStatus,
    example: StoreStatus.NOT_ACCEPTING_ORDER,
  })
  @IsEnum(StoreStatus)
  status: StoreStatus;
}
