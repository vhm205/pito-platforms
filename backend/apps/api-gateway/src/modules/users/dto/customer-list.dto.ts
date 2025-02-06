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

export class CustomerListDto {
  @ApiProperty({
    description: 'The unique identifier of the customer',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The first name of the customer',
    example: 'John Doe',
  })
  @Expose()
  @Transform(({ value }) => value ?? null)
  firstName: string;

  @ApiProperty({
    description: 'The last name of the customer',
    example: 'John Doe',
  })
  @Expose()
  @Transform(({ value }) => value ?? null)
  lastName: string;

  @ApiProperty({
    description: 'The email of the customer',
    example: 'john.doe@example.com',
    type: String,
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '84353448767',
    type: String,
  })
  @Expose()
  @Transform(({ value }) => value ?? null)
  phone: string;

  @ApiProperty({
    description: 'The company of the customer',
    example: 'John Doe Company',
  })
  @Expose()
  @Transform(({ value }) => value ?? null)
  company: string;

  @ApiProperty({
    description: 'The status of the customer',
    example: 0,
    type: Number,
  })
  @Expose()
  status: number;

  @ApiProperty({
    description: 'The time when the user was created',
    type: Date,
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'The time when the user was last updated',
    type: Date,
  })
  @Expose()
  @Transform(({ value }) => value ?? null)
  updatedAt: Date;
}

export class QueryCustomerListDto extends PaginationQueryDto {
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
