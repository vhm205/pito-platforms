import { NullableType } from '@app/common/types/common';
import { BusinessType, Certification } from '@app/common/types/proto/common';
import {
  FilterRuleDto,
  PaginationQueryDto,
  parseFilter,
  parseSort,
  SortRule,
  normalizeArray,
} from '@gateway/gateway-common/dto/query-dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsArray } from 'class-validator';

class RepresentativeContactDto {
  @Expose()
  @ApiProperty({
    description: 'The name of the representative',
    type: String,
    example: 'John Doe',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The email of the representative',
    type: String,
    example: 'jojn.doe@example.com',
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'The phone number of the representative',
    type: String,
    example: '0123456789',
  })
  phone: string;
}

export class PartnerListDto {
  @Expose()
  @ApiProperty({
    description: 'The id of the partner',
    type: String,
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'The name of the partner',
    type: String,
    example: 'Example Name',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The status of the partner',
    type: String,
    example: 'active',
  })
  status: string;

  @Expose()
  @Transform(({ value }) => value ?? null)
  @ApiPropertyOptional({
    description: 'The business type of the partner',
    enum: BusinessType,
    example: BusinessType.COMPANY,
  })
  businessType: NullableType<BusinessType>;

  @Expose()
  @ApiProperty({
    description: 'The representative contact of the partner',
    type: RepresentativeContactDto,
  })
  representativeContactDto: RepresentativeContactDto;

  @Expose()
  @Transform(({ value }) => value ?? null)
  @ApiPropertyOptional({
    description: 'The certificate type of the partner',
    enum: Certification,
    example: Certification.HACCP,
  })
  certification: NullableType<Certification>;

  @Expose()
  @ApiProperty({
    description: 'The address of the partner',
    type: String,
    example: '112 Dien Bien Phu, Binh Thanh, HCM',
  })
  businessAddress: string;

  @Expose()
  @ApiProperty({
    description: 'The created date of the partner',
    type: Date,
    example: '2021-09-22T08:00:00.000Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'The updated date of the partner',
    type: Date,
    example: '2021-09-22T08:00:00.000Z',
  })
  updatedAt: NullableType<Date>;
}

export class QueryPartnerListDto extends PaginationQueryDto {
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
