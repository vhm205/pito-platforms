import { parseSort, SortRule } from '@gateway/gateway-common/dto/query-dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsArray } from 'class-validator';

import { normalizeArray } from '../utils';

export class CateringPackageOptionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Option Name' })
  name: string;

  @ApiProperty({ example: 'active' })
  status: string;
}

class CateringPackageResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [CateringPackageOptionDto] })
  options: CateringPackageOptionDto[];
}

class OccasionEventsResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isActive: boolean;
}

export class GetCateringPackageResponseDto {
  @ApiProperty({ type: () => [CateringPackageResponse] })
  cateringPackages: CateringPackageResponse[];
}

export class GetCateringPackageAndOccasionEventResponseDto {
  @ApiProperty({ type: () => [CateringPackageResponse] })
  cateringPackages: CateringPackageResponse[];

  @ApiProperty({ type: () => [OccasionEventsResponse] })
  occationEvents: OccasionEventsResponse[];
}

export class GetCateringPackageOptionsRequestDto {
  @ApiPropertyOptional()
  @Expose({ name: 'sort' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseSort(value))
  sort: SortRule[];
}

export class GetCateringPackageOptionsResponseDto {
  @ApiProperty({
    type: [CateringPackageOptionDto],
  })
  options: CateringPackageOptionDto[];
}
