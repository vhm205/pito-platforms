// ... other imports
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class MetadataObjectDto {
  @ApiProperty({ example: 'banh-craft-artisan-bakery' })
  @IsString()
  @IsOptional()
  storeSlug: string;

  @ApiProperty({ example: 'ho-chi-minh' })
  @IsString()
  @IsOptional()
  regionSlug: string;
}

export class UpdateStoreRequestDto {
  @ApiProperty({ description: 'The name of the store', example: 'John’s Grocery Store' })
  @IsOptional()
  storeName: string;

  @ApiProperty()
  @IsOptional()
  slug: string;

  @ApiProperty()
  @IsOptional()
  isVat: boolean;

  @ApiProperty()
  @IsOptional()
  engagementLevel: number;

  @ApiProperty()
  @IsOptional()
  performanceLevel: number;

  @ApiProperty({
    description: 'Store image URLs',
    example: { cover: 'cover.jpg', avatar: 'avatar.jpg', thumbnail: 'thumbnail.jpg' },
  })
  @IsOptional()
  images: {
    cover: string;
    avatar: string;
    thumbnail: string;
  };

  @ApiProperty({
    description: 'Store contact information',
    example: [{ email: 'john@example.com', phone: '+1234567890', fullName: 'John Doe' }],
  })
  @IsOptional()
  contacts: {
    email: string;
    phone: string;
    fullName: string;
  }[];

  @ApiProperty({
    description: 'Store location details',
    example: {
      ward: 'Ward 1',
      region: 'Region A',
      address: '123 Main St',
      district: 'District 1',
      latitude: 10.7769,
      longitude: 106.7009,
    },
  })
  @IsOptional()
  location: {
    ward: string;
    region: string;
    address: string;
    district: string;
    latitude: number;
    longitude: number;
  };

  @ApiProperty({
    description: 'Store bank account information',
    example: {
      bankName: 'Bank A',
      bankBranch: 'Branch B',
      accountHolder: 'John Doe',
      accountNumber: '123456789',
    },
  })
  @IsOptional()
  bankAccount: {
    bankName: string;
    bankBranch: string;
    accountHolder: string;
    accountNumber: string;
  };

  @ApiProperty({
    description: 'A brief description of the store',
    example: 'This is a grocery store.',
  })
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataObjectDto)
  metadata: MetadataObjectDto;
}

export class UpdateStoreResponseDto {
  @ApiProperty()
  affectedRows: number;
}
