import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsPositive, IsString, ValidateNested } from 'class-validator';

export class ChoiceDto {
  @ApiProperty()
  @IsString()
  choiceId: string;

  @ApiProperty()
  @IsPositive()
  quantity: number;
}

class OptionChoiceDto {
  @ApiProperty()
  @IsString()
  optionId: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices: ChoiceDto[];
}

export class AddItemToCartRequestDto {
  @ApiProperty()
  @IsString()
  storeId: string;

  @ApiProperty()
  @IsString()
  itemId: string;

  @ApiProperty()
  @IsString()
  notes: string;

  @ApiProperty()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionChoiceDto)
  optionsChoices: OptionChoiceDto[];
}
