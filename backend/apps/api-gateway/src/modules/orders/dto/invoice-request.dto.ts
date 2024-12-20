import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class VatInfoDto {
  @ApiProperty({
    description: 'The email of the store',
    example: 'pito@vn',
    type: String,
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The address of the store',
    example: '112 Điện Biên Phủ, Phường ĐaKao, Quận 1, Tp. Hồ Chí Minh',
    type: String,
  })
  @Expose()
  address: string;

  @ApiProperty({
    description: 'The tax code of the store',
    example: '12433',
    type: String,
  })
  @Expose()
  taxCode: string;

  @ApiProperty({
    description: 'The company name of the store',
    example: 'PITO VN',
    type: String,
  })
  @Expose()
  companyName: string;
}

export class InvoiceRequestDto {
  @ApiProperty({
    description: 'The order id',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  orderId: string;

  @ApiProperty({
    description: 'The store id',
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    type: String,
  })
  @Expose()
  storeId: string;

  @ApiProperty({
    description: 'The order code',
    example: 'XPIGF0285',
    type: String,
  })
  @Expose()
  orderCode: string;

  @ApiProperty({
    description: 'Check if the invoice is requested',
    example: true,
    type: Boolean,
  })
  @Expose()
  invoiceRequested: boolean;

  @ApiProperty({
    description: 'Check if the invoice url is available',
    example: true,
    type: Boolean,
  })
  @Expose()
  invoiceUrlAvailable: boolean;

  @ApiProperty({
    description: 'The vat information',
    type: VatInfoDto,
  })
  @Expose()
  vatInfo: VatInfoDto;

  @ApiPropertyOptional({
    description: 'The invoice url',
    type: String,
  })
  @Expose()
  invoiceUrl?: string;
}
