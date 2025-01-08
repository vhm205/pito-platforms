import { StoreStatus } from '@app/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUUID } from 'class-validator';

const StoreStatusUpdate = [StoreStatus.NOT_ACCEPTING_ORDER, StoreStatus.TEMPORARILY_CLOSED];

export class UpdateStoreStatusRequestDto {
  @ApiProperty()
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];

  @ApiProperty({
    type: 'string',
    enum: StoreStatusUpdate,
    example: StoreStatus.NOT_ACCEPTING_ORDER,
  })
  @IsEnum(StoreStatusUpdate)
  status: StoreStatus;
}
