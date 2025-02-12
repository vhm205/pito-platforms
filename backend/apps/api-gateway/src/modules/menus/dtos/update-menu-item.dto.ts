import { ItemStatus } from '@app/common/enums/item';
import { UpdateItemSchema } from '@gateway/modules/menus/schemas/item.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { z } from 'zod';

export type UpdateItemDto = z.infer<typeof UpdateItemSchema>;

export class BulkUpdateItemsStatusDto {
  @ApiProperty({
    type: ItemStatus,
    enum: ItemStatus,
    example: ItemStatus.REJECTED,
    enumName: 'ItemStatus',
    description: 'The status of the item',
  })
  @IsEnum(ItemStatus)
  status: ItemStatus;

  @ApiPropertyOptional({
    type: 'string',
    description: 'The reason for rejection',
    example: 'Incomplete documents',
  })
  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
    },
    example: ['d290f1ee-6c54-4b01-90e6-d701748f0851'],
  })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}

export class BulkUpdateItemsStatusResponseDto {
  @ApiProperty({ example: 1, description: 'The number of affected rows in the database' })
  affectedRows: number;
}
