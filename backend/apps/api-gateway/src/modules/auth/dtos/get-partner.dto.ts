import { ApiProperty } from '@nestjs/swagger';

class BusinessOwnerDto {
  @ApiProperty({ description: 'Email of the business owner', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ description: 'Phone number of the business owner', example: '+15551234567' })
  phone: string;

  @ApiProperty({ description: 'Full name of the business owner', example: 'John Doe' })
  fullName: string;
}

class BusinessInfoDto {
  @ApiProperty({ description: 'Tax code of the business', example: '1234567890' })
  taxCode: string;

  @ApiProperty({ description: 'Name of the business', example: 'Example Corp' })
  businessName: string;

  @ApiProperty({ description: 'Type of the business', example: 'Technology' })
  businessType: string;

  @ApiProperty({ description: 'Registration date of the business', example: '2023-01-15' })
  registrationDate: string;

  @ApiProperty({
    description: 'Registration address of the business',
    example: '123 Main St, Anytown',
  })
  registrationAddress: string;

  @ApiProperty({ description: 'Registration number of the business', example: 'ABC123XYZ' })
  registrationNumber: string;
}

class BankAccountDto {
  @ApiProperty({ description: 'Name of the bank', example: 'Example Bank' })
  bankName: string;

  @ApiProperty({ description: 'Branch of the bank', example: 'Main Branch' })
  bankBranch: string;

  @ApiProperty({ description: 'Name of the account holder', example: 'John Doe' })
  accountHolder: string;

  @ApiProperty({ description: 'Account number', example: '1234567890' })
  accountNumber: string;
}

export class GetPartnerProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description: 'Creation timestamp',
    type: Date,
    example: '2023-10-27T10:00:00Z',
    format: 'date-time',
  })
  createdAt: Date | undefined;

  @ApiProperty({ description: 'Name of the partner', example: 'Partner A' })
  partnerName: string;

  @ApiProperty({
    description: 'Last update timestamp',
    type: Date,
    example: '2023-10-27T11:30:00Z',
    format: 'date-time',
  })
  updatedAt: Date | undefined;

  @ApiProperty({ description: 'Whether the partner is active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Status of the partner', example: 'APPROVED' })
  status: string;

  @ApiProperty({
    description: 'Business information of the partner',
    type: BusinessInfoDto,
  })
  businessInfo: BusinessInfoDto | undefined;

  @ApiProperty({ description: 'Type of the partner', example: 'INDIVIDUAL' })
  partnerType: string;

  @ApiProperty({
    description: 'Business owner information',
    type: BusinessOwnerDto,
  })
  businessOwner: BusinessOwnerDto | undefined;

  @ApiProperty({
    description: 'Array of service types',
    example: ['TYPE_A', 'TYPE_B'],
    type: [String],
  })
  serviceTypes: string[];

  @ApiProperty({
    description: 'Service fee rate (Use int32 for smallint)',
    example: 5,
    required: false,
  })
  serviceFeeRate?: number | undefined;

  @ApiProperty({ description: 'Whether the partner is VAT registered', example: false })
  isVat: boolean;

  @ApiProperty({
    description: 'Bank account of partner',
    type: BankAccountDto,
  })
  bankAccount: BankAccountDto | undefined;
}
