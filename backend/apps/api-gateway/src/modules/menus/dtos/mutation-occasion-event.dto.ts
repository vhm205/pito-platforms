import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateOccasionEventDto {
  @ApiProperty({ example: 'Event Name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateOccasionEventDto {
  @ApiProperty({ example: 'Updated Event Name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
