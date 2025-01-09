import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCateringPackageDto {
  @ApiProperty({ example: 'Package Name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateCateringPackageDto {
  @ApiProperty({ example: 'Updated Package Name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
