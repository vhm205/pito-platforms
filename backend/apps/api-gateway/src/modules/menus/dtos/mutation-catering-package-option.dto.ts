import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCateringPackageOptionDto {
  @ApiProperty({ example: 123 })
  @IsNotEmpty()
  @IsNumber()
  packageId: number;

  @ApiProperty({ example: 'Extra spicy' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'active' })
  @IsNotEmpty()
  @IsString()
  status: string;
}

export class UpdateCateringPackageOptionDto {
  @ApiProperty({ example: 'Less spicy', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'inactive', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
