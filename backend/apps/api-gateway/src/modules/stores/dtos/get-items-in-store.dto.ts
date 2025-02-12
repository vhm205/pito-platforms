import { GetItemInStoreResult, Item, OptionAndChoice } from '@app/common';
import { PaginationQueryDto } from '@app/common/dto';
import { transformArrayStringToNumber } from '@gateway/utils/transformers';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * [GET-PRODUCTS-IN-STORE] REQUEST DTO
 */
export class GetItemInStoreRequestDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  keyword: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  storeId: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  budgetMin: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  budgetMax: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(transformArrayStringToNumber)
  occasionEvents: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(transformArrayStringToNumber)
  specialDietaries: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(transformArrayStringToNumber)
  serviceTypes: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(transformArrayStringToNumber)
  cuisineTypes: number[];
}

/**
 * [GET-PRODUCTS-IN-STORE] RESPONSE DTO
 */
class ChoiceOfOptionDto {
  @ApiProperty({
    description: 'Unique identifier for the choice',
    example: '1',
  })
  choiceId: string;

  @ApiProperty({
    description: 'Name of the choice',
    example: 'Extra Cheese',
  })
  name: string;

  @ApiProperty({
    description: 'Additional price for this choice',
    example: 5.0,
  })
  basePrice: number;

  @ApiProperty({
    description: 'Indicates if this choice is active',
    example: false,
  })
  isActive: boolean;
}

class OptionAndChoiceDto implements OptionAndChoice {
  @ApiProperty({
    description: 'Unique identifier for the option',
    example: 'option123',
  })
  optionId: string;

  @ApiProperty({
    description: 'description of the option',
    example: 'description',
  })
  description: string;

  @ApiProperty({
    description: 'Option is active or not',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Name of the option',
    example: 'Toppings',
  })
  name: string;

  @ApiProperty({
    description: 'Indicates if this option is required',
    example: true,
  })
  isRequired: boolean;

  @ApiProperty({
    description: 'Maximum number of choices allowed',
    example: 3,
  })
  maxChoices: number;

  @ApiProperty({
    description: 'Indicates if multiple choices are allowed',
    example: true,
  })
  isMultipleChoice: boolean;

  @ApiProperty({
    description: 'Indicates if quantity selection is allowed',
    example: false,
  })
  isSelectionQuantityAllowed: boolean;

  @ApiProperty({
    description: 'List of choices available for this option',
    type: [ChoiceOfOptionDto],
  })
  choices: ChoiceOfOptionDto[];
}

class FilterOption {
  @ApiProperty({
    description: 'Unique identifier for the option',
    example: 101,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the option',
    example: 'Italian',
  })
  name: string;
}

export class ItemDto implements Item {
  @ApiProperty({ type: String, description: 'The unique identifier of the item.' })
  id: string;

  @ApiProperty({ type: String, description: 'The slug (URL-friendly name) of the item.' })
  slug: string;

  @ApiProperty({ type: String, description: 'The name of the item.' })
  name: string;

  @ApiProperty({ type: Number, description: 'The base price of the item.' })
  basePrice: number;

  @ApiProperty({ type: String, description: 'The description of the item.' })
  description: string;

  @ApiProperty({ type: String, description: 'The extra description of the item.' })
  extraDescription: string;

  @ApiProperty({ type: [String], description: 'The list of image URLs for the item.' })
  images: string[];

  @ApiProperty({ type: String, description: 'The store ID associated with the item.' })
  storeId: string;

  @ApiProperty({ type: Number, description: 'The minimum quantity for the item.' })
  minQuantity: number;

  @ApiProperty({ type: Number, description: 'The maximum quantity for the item.' })
  maxQuantity: number;

  @ApiProperty({ type: String, description: 'The type of unit for the item.' })
  unitType: string;

  @ApiProperty({ type: String, description: 'The packaging type for the item.' })
  packagingType: string;

  @ApiProperty({ type: String, description: 'The type of eating utensil for the item.' })
  eatingUtensil: string;

  @ApiProperty({ type: String, description: 'Any special note for the item.' })
  specialNote: string;

  @ApiProperty({ type: Number, description: 'The unit quantity for the item.' })
  unitQuantity: number;

  @ApiProperty({ type: Number, description: 'The preparation time required for the item.' })
  preparationTime: number;

  @ApiProperty({
    type: [OptionAndChoiceDto],
    description: 'The options and choices available for the item.',
  })
  optionsAndChoices: OptionAndChoiceDto[];

  @ApiProperty({ type: [Number], description: 'The special dietary IDs associated with the item.' })
  specialDietaries: number[];

  @ApiProperty({ type: [Number], description: 'The cuisine type IDs associated with the item.' })
  cuisineTypes: number[];

  @ApiProperty({ type: [Number], description: 'The occasion event IDs associated with the item.' })
  occasionEvents: number[];
}

export class GetItemInStoreResponseDto implements GetItemInStoreResult {
  @ApiProperty({ type: ItemDto, description: 'The item details.' })
  item: ItemDto;

  @ApiProperty({
    type: [FilterOption],
    description: 'List of special dietary options for the item.',
  })
  specialDietaries: FilterOption[];

  @ApiProperty({ type: [FilterOption], description: 'List of cuisine type options for the item.' })
  cuisineTypes: FilterOption[];

  @ApiProperty({
    type: [FilterOption],
    description: 'List of occasion event options for the item.',
  })
  occasionEvents: FilterOption[];

  @ApiProperty({
    type: [OptionAndChoiceDto],
    description: 'List of options and choices for the item.',
  })
  optionsAndChoices: OptionAndChoiceDto[];
}
