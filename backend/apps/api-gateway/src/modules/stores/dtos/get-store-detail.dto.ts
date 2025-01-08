import { ApiProperty } from '@nestjs/swagger';

class Location {
  @ApiProperty({ example: 'Phường 1' })
  ward: string;

  @ApiProperty({ example: 'Quận 1' })
  region: string;

  @ApiProperty({ example: '123 Đường ABC' })
  address: string;

  @ApiProperty({ example: 'Thành phố Hồ Chí Minh' })
  district: string;

  @ApiProperty({ example: 10.762622 })
  latitude: number;

  @ApiProperty({ example: 106.660172 })
  longitude: number;
}

class ContactInfo {
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '+84901234567' })
  phone: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;
}

class BankAccount {
  @ApiProperty({ example: 'Ngân hàng ABC' })
  bankName: string;

  @ApiProperty({ example: 'Chi nhánh XYZ' })
  bankBranch: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  accountHolder: string;

  @ApiProperty({ example: '1234567890123' })
  accountNumber: string;
}

class Image {
  @ApiProperty({ example: 'https://example.com/cover.jpg' })
  cover: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatar: string;

  @ApiProperty({ example: 'https://example.com/thumbnail.jpg' })
  thumbnail: string;
}

class CuisineType {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ẩm thực Việt Nam' })
  name: string;
}

export class GetStoreDetailResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  partnerId: string;

  @ApiProperty({ example: 'Cửa hàng ABC' })
  name: string;

  @ApiProperty({ example: 'ABC_STORE' })
  storeCode: string;

  @ApiProperty({ example: 'open' })
  status: string;

  @ApiProperty({ example: true })
  isVat: boolean;

  @ApiProperty({ example: 'cua-hang-abc' })
  slug: string;

  @ApiProperty({ required: false, example: 'Mô tả cửa hàng' })
  description?: string | undefined;

  @ApiProperty({ required: false, type: Location })
  location: Location | undefined;

  @ApiProperty({ required: false, type: Image })
  images: Image | undefined;

  @ApiProperty({ isArray: true, type: ContactInfo })
  contacts: ContactInfo[];

  @ApiProperty({ required: false, type: BankAccount })
  bankAccount: BankAccount | undefined;

  @ApiProperty({
    required: false,
    additionalProperties: true,
    example: { prepTime: 30, anotherField: 'value' },
  })
  prepTimes: { [key: string]: any } | undefined;

  @ApiProperty({
    required: false,
    additionalProperties: true,
    example: { someKey: 'someValue', anotherKey: 123 },
  })
  metadata: { [key: string]: any } | undefined;

  @ApiProperty({ required: false, example: '2023-10-27T10:00:00Z' })
  createdAt: Date | undefined;

  @ApiProperty({ required: false, example: '2023-10-27T11:30:00Z' })
  updatedAt: Date | undefined;

  @ApiProperty({ isArray: true, type: CuisineType })
  cuisineTypes: CuisineType[];

  @ApiProperty({ required: false, example: '2023-10-28T08:00:00Z' })
  reopenTime: Date | undefined;
}
