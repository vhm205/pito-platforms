import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCateringPackageOptionDto {
  @ApiProperty({ example: 'Extra spicy' })
  @IsNotEmpty()
  @IsString()
  name: string;
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
