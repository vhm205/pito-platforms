import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FileDto {
  @ApiProperty({
    description: 'The id of the file',
    example: '1',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'The path of the file',
    example: 'https://s3.amazonaws.com/bucket-name/file-name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({
    description: 'The full path of the file',
    example: 'https://s3.amazonaws.com/bucket-name/file-name',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  fullPath?: string;
}
