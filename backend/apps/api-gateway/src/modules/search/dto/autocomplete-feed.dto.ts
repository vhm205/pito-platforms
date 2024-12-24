import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { AutocompleteFeedDocument, AutocompleteFeedResponse } from '../domain/autocomplete.domain';
import { AutocompleteFeedSyncAction } from '../enum';

// const MIN_QUERY_LENGTH = 2;
const DEFAULT_MAX_RESULTS = 5;

export class AutocompleteFeedQueryDto {
  @ApiProperty({
    description: 'The query to search',
    example: 'chicken',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  query: string;

  @ApiPropertyOptional({
    description: 'The maximum number of results to return',
    example: DEFAULT_MAX_RESULTS,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value) ?? DEFAULT_MAX_RESULTS)
  limit: number = DEFAULT_MAX_RESULTS;
}

export class AutocompleteFeedDocumentDto implements AutocompleteFeedDocument {
  @ApiProperty({
    description: 'The unique identifier of the entity',
    example: '123',
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The status of the entity',
    example: true,
    type: Boolean,
  })
  @Expose({ name: 'isActive' })
  @IsBoolean()
  @Transform(({ value }) => value, { toClassOnly: true }) // Ensures the transformation
  is_active: boolean;

  @ApiProperty({
    description: 'The type of entity',
    example: 'item',
    type: String,
  })
  @Expose({ name: 'entityType' })
  @Transform(({ value }) => value, { toClassOnly: true }) // Ensures the transformation
  @IsString()
  entity_type: string;

  @ApiProperty({
    description: 'The term to index',
    example: 'chicken',
    type: String,
  })
  @IsString()
  term: string;
}

export class IndexAutocompleteFeedRequestBodyDto {
  @ApiProperty({
    description: 'Action to perform on the document: create, update, upsert, emplace',
    enum: AutocompleteFeedSyncAction,
    example: AutocompleteFeedSyncAction.CREATE,
  })
  @IsEnum(AutocompleteFeedSyncAction)
  action: AutocompleteFeedSyncAction;

  @ApiProperty({
    description: 'The document to index',
    type: [AutocompleteFeedDocumentDto],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AutocompleteFeedDocumentDto)
  documents: AutocompleteFeedDocumentDto[];
}

export class AutocompleteFeedResponseDto implements AutocompleteFeedResponse {
  @ApiProperty({
    description: 'The unique identifier of the entity',
    example: '123',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'The type of entity',
    example: 'item',
    type: String,
  })
  @Expose({ name: 'entityType' })
  @Transform(({ value }) => value, { toClassOnly: true })
  @IsString()
  entity_type: string;

  @ApiProperty({
    description: 'The highlighted text',
    example: 'chicken',
    type: String,
  })
  highlight: string;

  @ApiProperty({
    description: 'The label to display',
    example: 'Chicken',
    type: String,
  })
  label: string;
}
