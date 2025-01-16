import { DishQuantityUnit } from '@app/common/enums/dish';
import { CreateDishRequest } from '@app/common/types/proto/dish/dish';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsArray, IsEnum, IsUUID } from 'class-validator';

export class CreateDishDto implements CreateDishRequest {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiProperty({
    example: DishQuantityUnit.GRAM,
    type: String,
    enum: DishQuantityUnit,
  })
  @IsOptional()
  @IsEnum(DishQuantityUnit)
  quantityUnit?: DishQuantityUnit;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  storeId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  partnerId: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  packageOptionId?: number;
}

export class UpdateDishDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiProperty({
    example: DishQuantityUnit.GRAM,
    type: String,
    enum: DishQuantityUnit,
  })
  @IsOptional()
  @IsEnum(DishQuantityUnit)
  quantityUnit?: DishQuantityUnit;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  storeId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  partnerId: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  packageOptionId?: number;
}

export class UpdateDishResponseDto {
  @ApiResponseProperty({ type: Number })
  affectedRows: number;
}

export class DeleteDishResponseDto {
  @ApiResponseProperty({ type: Boolean })
  success: boolean;
}
