import { SourceSystemType } from '@app/common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class FindMenuCategoryRequestDto {
  @ApiPropertyOptional({
    description: 'Service Category',
    enum: SourceSystemType,
    example: SourceSystemType.PX,
    required: false,
  })
  @IsEnum(SourceSystemType)
  @IsOptional()
  serviceCategory?: SourceSystemType;
}

export class MenuCategoryDto {
  @ApiProperty({ description: 'ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Is Active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'Created At' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Updated At' })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'Metadata' })
  @Type(() => Object)
  metadata: object;

  @ApiProperty({ description: 'Total Items' })
  @IsInt()
  totalItems: number;

  @ApiProperty({ description: 'Type' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Notes' })
  @IsString()
  notes: string;

  @ApiProperty({ description: 'Index' })
  @IsInt()
  index: number;
}
