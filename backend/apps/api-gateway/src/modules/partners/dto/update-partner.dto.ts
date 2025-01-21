import { PartnerStatus, ServiceType } from '@app/common/enums/partner';
import { BusinessType, Certification } from '@app/common/types/proto/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsArray,
  IsDateString,
} from 'class-validator';

export class FinancialManagerDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  fullName: string;
}

export class BankAccountInfoDto {
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  bankBranch: string;

  @IsNotEmpty()
  @IsString()
  accountHolder: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FinancialManagerDto)
  financialManager: FinancialManagerDto;
}

export class CitizenImageDto {
  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}

export class CitizenInfoDto {
  @IsNotEmpty()
  @IsString()
  citizenId: string;

  @IsNotEmpty()
  @IsDateString()
  issueDate: string;

  @IsNotEmpty()
  @IsDateString()
  expiryDate: string;

  @IsNotEmpty()
  @IsString()
  issuePlace: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CitizenImageDto)
  citizenImages: CitizenImageDto[];

  @IsNotEmpty()
  @IsString()
  residentAddress: string;
}

export class BusinessOwnerDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CitizenInfoDto)
  citizenInfo: CitizenInfoDto;
}

export class BusinessInfoDto {
  @ApiProperty({ example: '123456789', description: 'The tax code of the business' })
  @IsNotEmpty()
  @IsString()
  taxCode: string;

  @ApiProperty({ example: 'My Business', description: 'The name of the business' })
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @ApiProperty({ example: 'Retail', description: 'The type of the business' })
  @IsNotEmpty()
  @IsString()
  businessType: string;

  @ApiProperty({ example: '2021-01-01', description: 'The registration date of the business' })
  @IsNotEmpty()
  @IsDateString()
  registrationDate: string;

  @ApiProperty({
    example: '123 Business St.',
    description: 'The registered address of the business',
  })
  @IsNotEmpty()
  @IsString()
  registeredAddress: string;

  @ApiProperty({ example: '987654321', description: 'The registration number of the business' })
  @IsString()
  registrationNumber: string;

  @ApiProperty({ example: ['license1.jpg', 'license2.jpg'], description: 'The business licenses' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  businessLicenses: string[];
}

export class UpdatePartnerRequestDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the partner' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: PartnerStatus.APPROVED,
    enum: PartnerStatus,
    description: 'The status of the partner',
    type: 'string',
  })
  @IsOptional()
  @IsEnum(PartnerStatus)
  status?: PartnerStatus;

  @ApiProperty({ example: 5, description: 'The service fee rate of the partner' })
  @IsOptional()
  @IsInt()
  serviceFeeRate?: number;

  @ApiProperty({
    example: BusinessType.BUSINESS_HOUSEHOLD,
    description: 'The business type of the partner',
  })
  @IsOptional()
  @IsEnum(BusinessType)
  businessType?: BusinessType;

  @ApiProperty({
    example: Certification.HACCP,
    description: 'The certification status of the partner',
  })
  @IsOptional()
  @IsEnum(Certification)
  certification?: Certification;

  @ApiProperty({
    type: () => BankAccountInfoDto,
    description: 'The bank account information of the partner',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BankAccountInfoDto)
  bankAccount: BankAccountInfoDto;

  @ApiProperty({
    type: () => BusinessInfoDto,
    description: 'The business information of the partner',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessInfoDto)
  businessInfo: BusinessInfoDto;

  @ApiProperty({
    type: () => BusinessOwnerDto,
    description: 'The business owner information of the partner',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessOwnerDto)
  businessOwner: BusinessOwnerDto;

  @IsOptional()
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  serviceTypes: ServiceType[];

  @IsOptional()
  @IsBoolean()
  isVat?: boolean;
}

export class UpdatePartnerResponseDto {
  @ApiProperty()
  affectedRows: number;
}
