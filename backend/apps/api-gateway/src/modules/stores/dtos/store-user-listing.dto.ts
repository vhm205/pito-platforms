import {
  FilterRuleDto,
  PaginationQueryDto,
  parseFilter,
  parseSort,
  SortRule,
  normalizeArray,
} from '@gateway/gateway-common/dto/query-dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsArray } from 'class-validator';

export class QueryStoreUserDto extends PaginationQueryDto {
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

export class StoreUserListingDto {
  @ApiProperty({
    description: 'The unique identifier for the user.',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'The full name of the user.',
    type: String,
  })
  fullName: string;

  @ApiProperty({
    description: 'The email address of the user.',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'The phone number of the user.',
    type: String,
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'The unique identifier for the store that the user is associated with.',
    type: Number,
  })
  storeUid: number;

  @ApiProperty({
    description: 'Indicates whether the user is banned or not.',
    type: Boolean,
  })
  isBanned: boolean;

  @ApiProperty({
    description: 'The avatar URL of the user.',
    type: String,
    required: false,
  })
  avatarUrl?: string;

  @ApiProperty({
    description: 'The list of roles assigned to the user.',
    type: [String], // This indicates it's an array of strings
  })
  userRoles: string[];

  @ApiProperty({
    description: 'The date when the user was created.',
    type: Date,
    required: false,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated.',
    type: Date,
    required: false,
  })
  updatedAt?: Date;
}
