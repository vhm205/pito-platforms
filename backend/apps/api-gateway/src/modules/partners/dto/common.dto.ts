import { getPublicImageURL } from '@app/common';
import { BusinessType } from '@app/common/types/proto/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { isString } from 'lodash';

export class PartnerLocationDto {
  @ApiProperty({
    description: 'Region of the location',
    example: 'Ho Chi Minh',
    type: String,
  })
  @Expose()
  @Type(() => String)
  region: string;

  @ApiProperty({
    description: 'Ward of the location',
    example: 'Ward 10',
    type: String,
  })
  @Expose()
  @Type(() => String)
  ward: string;

  @ApiProperty({
    description: 'Address of the location',
    example: '339/10 Le Van Sy',
    type: String,
  })
  @Expose()
  @Type(() => String)
  address: string;

  @ApiProperty({
    description: 'District of the location',
    example: 'District 3',
    type: String,
  })
  @Expose()
  @Type(() => String)
  district: string;

  @ApiProperty({
    description: 'Latitude of the location',
    example: 21.028511,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the location',
    example: 105.801944,
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  longitude: number;
}

enum LicenseType {
  BUSINESS_REGISTRATION = 'business_registration_license',
  RELATED_IMAGES = 'related_images',
}

enum CitizenImageType {
  CITIZEN_PHOTO_BEFORE = 'citizen_photo_before',
  CITIZEN_PHOTO_AFTER = 'citizen_photo_after',
}

class BusinessLicenseDto {
  @IsString()
  @Transform(({ value }) => getPublicImageURL('business-documents', value))
  path: string;

  @IsEnum(LicenseType)
  type: LicenseType;
}

export class BusinessInfoDto {
  @Expose({ name: 'tax_code' })
  @IsString()
  taxCode: string;

  @Expose({ name: 'business_name' })
  @IsString()
  businessName: string;

  @Expose({ name: 'business_type' })
  @IsEnum(BusinessType)
  businessType: BusinessType;

  @Expose({ name: 'business_licenses' })
  @IsArray()
  @IsOptional()
  @IsArray({ each: true })
  @Transform(({ value }) => (isString(value) ? JSON.parse(value) : value))
  @Transform(({ value }) => plainToClass(BusinessLicenseDto, value), { toClassOnly: true })
  businessLicenses: BusinessLicenseDto[];

  @Expose({ name: 'registration_date' })
  @IsDateString()
  registrationDate: string;

  @Expose({ name: 'registered_address' })
  @IsString()
  registeredAddress: string;

  @Expose({ name: 'registration_number' })
  @IsString()
  registrationNumber: string;
}

class FinancialManagerDto {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsPhoneNumber('VN')
  phone: string;

  @Expose({ name: 'full_name' })
  @IsString()
  fullName: string;
}

export class BankAccountDto {
  @Expose({ name: 'bank_name' })
  @IsString()
  bankName: string;

  @Expose({ name: 'bank_branch' })
  @IsString()
  bankBranch: string;

  @Expose({ name: 'account_holder' })
  @IsString()
  accountHolder: string;

  @Expose({ name: 'account_number' })
  @IsString()
  accountNumber: string;

  @Expose({ name: 'financial_manager' })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => plainToClass(FinancialManagerDto, value), { toClassOnly: true })
  financialManager: FinancialManagerDto | null;
}

class CitizenImageDto {
  @Expose()
  @IsString()
  @Transform(({ value }) => getPublicImageURL('business-documents', value))
  path: string;

  @Expose()
  @IsEnum(CitizenImageType)
  type: CitizenImageType;
}

class CitizenInfoDto {
  @Expose({ name: 'citizen_id' })
  @IsString()
  citizenId: string;

  @Expose({ name: 'issue_date' })
  @IsDateString()
  issueDate: string;

  @Expose({ name: 'expiry_date' })
  @IsDateString()
  expiryDate: string;

  @Expose({ name: 'issue_place' })
  @IsString()
  issuePlace: string;

  @Expose({ name: 'citizen_images' })
  @IsArray()
  @IsArray({ each: true })
  @Transform(({ value }) => (isString(value) ? JSON.parse(value) : value))
  @Transform(({ value }) => plainToClass(CitizenImageDto, value), { toClassOnly: true })
  citizenImages: CitizenImageDto[];

  @Expose({ name: 'resident_address' })
  @IsString()
  residentAddress: string;
}

export class BusinessOwnerDto {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsPhoneNumber('VN')
  phone: string;

  @Expose({ name: 'full_name' })
  @IsString()
  fullName: string;

  @Expose({ name: 'citizen_info' })
  @IsObject()
  @IsOptional()
  @Transform(({ value }) => plainToClass(CitizenInfoDto, value), { toClassOnly: true })
  citizenInfo: CitizenInfoDto | null;
}
