import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class AssignOptionsToPackageDto {
  @ApiProperty({
    description: 'Array of option IDs to assign to the package',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  optionIds: number[];
}
