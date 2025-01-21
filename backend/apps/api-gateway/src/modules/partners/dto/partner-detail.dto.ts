import { ServiceType } from '@app/common/enums/partner';
import { BusinessType, Certification } from '@app/common/types/proto/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, plainToClass, Transform } from 'class-transformer';

import { BankAccountDto, BusinessInfoDto, BusinessOwnerDto } from './common.dto';

export class PartnerDetailDto {
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
  @ApiProperty({
    description: 'The type of the business',
    example: BusinessType.COMPANY,
    enum: BusinessType,
    enumName: 'BusinessType',
  })
  businessType: BusinessType;

  @Expose()
  @ApiPropertyOptional({
    description: 'The certificate type of the partner',
    enum: Certification,
    example: Certification.HACCP,
    enumName: 'Certification',
  })
  @Transform(({ value }) => value ?? null)
  certification: Certification;

  @Expose()
  @ApiProperty({
    description: 'The representative contact of the partner',
    type: BusinessInfoDto,
  })
  @Transform(({ value }) => plainToClass(BusinessInfoDto, value), { toClassOnly: true })
  businessInfo: BusinessInfoDto;

  @Expose()
  @ApiProperty({
    description: 'The representative contact of the partner',
    type: BusinessOwnerDto,
  })
  @Transform(({ value }) => plainToClass(BusinessOwnerDto, value), { toClassOnly: true })
  businessOwner: BusinessOwnerDto;

  @Expose()
  @ApiProperty({
    description: 'The representative contact of the partner',
    type: BankAccountDto,
  })
  @Transform(({ value }) => plainToClass(BankAccountDto, value), { toClassOnly: true })
  bankAccount: BankAccountDto;

  @Expose()
  @ApiProperty({
    description: 'The representative contact of the partner',
    enum: [ServiceType],
  })
  serviceTypes: ServiceType[];

  @Expose()
  @ApiProperty({
    description: 'The representative contact of the partner',
    type: Object,
  })
  serviceFeeRate: number;

  @Expose()
  @ApiProperty({
    description: 'The representative contact of the partner',
    type: Object,
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'The representative contact of the partner',
    type: Object,
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
  })
  isVat: boolean;
}
