import { StoreStatus } from '@app/common/enums';
import { StoreEngagementLevel, StorePerformanceLevel } from '@app/common/types/proto/common';
import {
  FilterRuleDto,
  PaginationQueryDto,
  parseFilter,
  parseSort,
  SortRule,
  normalizeArray,
} from '@gateway/gateway-common/dto/query-dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass, Transform } from 'class-transformer';
import { IsArray } from 'class-validator';

import { StoreLocationDto } from './common';

class StoreContactDto {
  @ApiProperty({
    description: 'The email of the store',
    example: 'john.doe@example.com',
    type: String,
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The phone number of the store',
    example: '84353448767',
    type: String,
  })
  @Expose()
  phone: string;

  @ApiProperty({
    description: 'The full name of the store contact',
    example: 'John Doe',
    type: String,
  })
  @Expose()
  fullName: string;
}

export class StoreListDto {
  @ApiProperty({
    description: 'The unique identifier of the store',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  id: string;

  @Expose()
  @ApiProperty({
    description: 'The status of the store',
    example: StoreStatus.ACTIVE,
    enum: StoreStatus,
  })
  status: StoreStatus;

  @ApiProperty({
    description: 'The name of the store',
    example: 'John Doe Store',
    type: String,
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The slug of the store',
    example: 'john-doe-store',
    type: String,
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'The location of the store',
    type: StoreLocationDto,
  })
  @Expose()
  @Transform(({ value }) => plainToClass(StoreLocationDto, value), { toClassOnly: true })
  location: StoreLocationDto;

  @ApiProperty({
    description: 'The contacts of the store',
    type: [StoreContactDto],
  })
  @Expose()
  contacts: StoreContactDto[];

  @ApiProperty({
    description: 'The time when the store was created',
    type: Date,
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'The time when the store was last updated',
    type: Date,
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({
    description: 'The engagement level of the store',
    example: StoreEngagementLevel.EXCLUSIVE,
    enum: StoreEngagementLevel,
    enumName: 'StoreEngagementLevel',
  })
  @Expose()
  engagementLevel: StoreEngagementLevel;

  @ApiProperty({
    description: 'The performance level of the store',
    example: StorePerformanceLevel.EXCELLENT,
    enum: StorePerformanceLevel,
    enumName: 'StorePerformanceLevel',
  })
  @Expose()
  performanceLevel: StorePerformanceLevel;
}

export class QueryStoreListDto extends PaginationQueryDto {
  @Expose({ name: 'filter' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseFilter(value))
  filters: FilterRuleDto[];

  @Expose({ name: 'sort' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseSort(value))
  sorts: SortRule[];
}
