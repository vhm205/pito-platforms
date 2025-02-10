import { getPublicImageURL } from '@app/common';
import { OnboardingStatus, PartnerType } from '@app/common/enums/partner';
import {
  FilterRuleDto,
  PaginationQueryDto,
  parseFilter,
  parseSort,
  SortRule,
  normalizeArray,
} from '@gateway/gateway-common/dto/query-dto';
import { transformFilterOnboarding } from '@gateway/modules/partners/utils/transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, plainToClass, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class ImageUploadDto {
  @Expose({ name: 'path' })
  @IsString()
  @Transform(({ value }) => value && getPublicImageURL('business-documents', value))
  path: string;

  @Expose({ name: 'type' })
  @IsString()
  type: string;
}

export class CitizenInfoDto {
  @Expose({
    name: 'citizen_id',
  })
  @IsString()
  citizenId: string;

  @Expose({ name: 'issue_date' })
  @IsString()
  issueDate: string;

  @Expose({ name: 'issue_place' })
  @IsString()
  issuePlace: string;

  @Expose({ name: 'expiry_date' })
  @IsString()
  expiryDate: string;

  @Expose({ name: 'resident_address' })
  @IsString()
  residentAddress: string;

  @Expose({ name: 'citizen_images' })
  @IsArray()
  @Type(() => ImageUploadDto)
  citizenImages: ImageUploadDto[];
}

export class ContractSignatoryDto {
  @Expose({
    name: 'is_not_representative',
  })
  @IsBoolean()
  isNotRepresentative: boolean;

  @Expose({
    name: 'authorization_images',
  })
  @IsArray()
  @Type(() => ImageUploadDto)
  authorizationImages: ImageUploadDto[];

  @Expose({
    name: 'signatory_name',
  })
  @IsOptional()
  @IsString()
  signatoryName?: string | null;

  @Expose({
    name: 'signatory_position',
  })
  @IsOptional()
  @IsString()
  signatoryPosition?: string | null;
}

export class RawOwnerMetadataDto {
  @Expose({ name: 'full_name' })
  @IsString()
  fullName: string;

  @Expose({ name: 'email' })
  @IsString()
  @IsEmail()
  email: string;

  @Expose({ name: 'phone' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phone: string;

  @Expose({ name: 'citizen_info' })
  @IsOptional()
  @Type(() => CitizenInfoDto)
  @ValidateNested()
  citizenInfo?: CitizenInfoDto | null;

  @Expose({ name: 'contract_signatory' })
  @IsOptional()
  @Type(() => ContractSignatoryDto)
  @ValidateNested()
  contractSignatory?: ContractSignatoryDto | null;
}

export class RawBusinessMetadataDto {
  @Expose({ name: 'business_name' })
  @IsString()
  businessName: string;

  @Expose({ name: 'business_type' })
  @IsOptional()
  @IsString()
  businessType?: string | null;

  @Expose({ name: 'service_types' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceTypes?: string[] | null;

  @Expose({ name: 'registration_date' })
  @IsOptional()
  @IsString()
  registrationDate?: string | null;

  @Expose({ name: 'registered_address' })
  @IsOptional()
  @IsString()
  registeredAddress?: string | null;

  @Expose({ name: 'registration_number' })
  @IsOptional()
  @IsString()
  registrationNumber?: string | null;

  @Expose({ name: 'tax_code' })
  @IsOptional()
  @IsString()
  taxCode?: string | null;

  @Expose({ name: 'business_licenses' })
  @IsOptional()
  @IsArray()
  @Type(() => ImageUploadDto)
  businessLicenses?: ImageUploadDto[] | null;

  @Expose({ name: 'is_vat' })
  @IsBoolean()
  isVat: boolean = false;
}

export class RawBankAccountMetadataDto {
  @Expose({ name: 'account_holder' })
  @IsOptional()
  @IsString()
  accountHolder?: string | null;

  @Expose({ name: 'account_number' })
  @IsOptional()
  @IsString()
  accountNumber?: string | null;

  @Expose({ name: 'bank_name' })
  @IsOptional()
  @IsString()
  bankName?: string | null;

  @Expose({ name: 'bank_branch' })
  @IsOptional()
  @IsString()
  bankBranch?: string | null;

  @Expose({ name: 'financial_manager' })
  @IsOptional()
  @Type(() => RawOwnerMetadataDto)
  @ValidateNested()
  financialManager?: Pick<RawOwnerMetadataDto, 'fullName' | 'email' | 'phone'> | null;
}

export class MetadataDto {
  @Expose({ name: 'rejection_reason' })
  @IsOptional()
  @IsString()
  rejectionReason?: string | null;
}

export class OnboardingDto {
  @ApiProperty({
    description: 'The unique identifier of the onboarding',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The status of the onboarding',
    example: 'PENDING',
    enum: OnboardingStatus,
  })
  @Expose()
  status: OnboardingStatus;

  @ApiProperty({
    description: 'The email confirmation status',
    example: 'CONFIRMED',
    type: String,
  })
  @Expose()
  emailConfirmation: string;

  @ApiProperty({
    description: 'The type of the partner',
    example: 'BUSINESS',
    enum: PartnerType,
  })
  @Expose()
  partnerType: PartnerType;

  @ApiProperty({
    description: 'Raw owner metadata',
    example: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      citizenInfo: {
        citizenId: '123456789',
        issueDate: '2020-01-01',
        issuePlace: 'City Hall',
        expiryDate: '2030-01-01',
        residentAddress: '123 Main St',
        citizenImages: [
          { path: 'path/to/image1.jpg', type: 'image/jpeg' },
          { path: 'path/to/image2.jpg', type: 'image/jpeg' },
        ],
      },
      contractSignatory: {
        isNotRepresentative: false,
        authorizationImages: [
          { path: 'path/to/image1.jpg', type: 'image/jpeg' },
          { path: 'path/to/image2.jpg', type: 'image/jpeg' },
        ],
        signatoryName: 'Jane Doe',
        signatoryPosition: 'Manager',
      },
    },
    type: RawOwnerMetadataDto,
  })
  @Expose()
  @Transform(({ value }) => plainToClass(RawOwnerMetadataDto, value), { toClassOnly: true })
  rawOwnerMetadata: Record<string, any>;

  @ApiProperty({
    description: 'Raw business metadata',
    example: {
      businessName: 'Example Business',
      businessType: 'LLC',
      serviceTypes: ['Consulting', 'Development'],
      registrationDate: '2020-01-01',
      registeredAddress: '456 Business Rd',
      registrationNumber: '987654321',
      taxCode: 'TAX123456',
      businessLicenses: [
        { path: 'path/to/license1.jpg', type: 'image/jpeg' },
        { path: 'path/to/license2.jpg', type: 'image/jpeg' },
      ],
      isVat: true,
    },
    type: RawBusinessMetadataDto,
  })
  @Expose()
  @Transform(({ value }) => plainToClass(RawBusinessMetadataDto, value), { toClassOnly: true })
  rawBusinessMetadata: Record<string, any>;

  @ApiProperty({
    description: 'Raw bank account metadata',
    example: {
      accountHolder: 'John Doe',
      accountNumber: '123456789',
      bankName: 'Example Bank',
      bankBranch: 'Main Branch',
      financialManager: {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1234567890',
      },
    },
    type: RawBankAccountMetadataDto,
  })
  @Expose()
  @Transform(({ value }) => plainToClass(RawBankAccountMetadataDto, value), { toClassOnly: true })
  rawBankAccountMetadata: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: {
      rejectionReason: 'Incomplete documents',
    },
    type: MetadataDto,
  })
  @Expose()
  @Transform(({ value }) => plainToClass(MetadataDto, value), { toClassOnly: true })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Created time of the onboarding',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Updated time of the onboarding',
    example: '2021-09-01T00:00:00.000Z',
    type: Date,
  })
  @Expose()
  @IsOptional()
  updatedAt?: Date;
}

export class OperatorQueryOnboardingDto extends PaginationQueryDto {
  @Expose({ name: 'filter' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseFilter(value).map(transformFilterOnboarding))
  filters: FilterRuleDto[];

  @Expose({ name: 'sort' })
  @IsArray()
  @Transform(({ value }) => normalizeArray(value), { toClassOnly: true })
  @Transform(({ value }) => parseSort(value))
  sorts: SortRule[];
}
