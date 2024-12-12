import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { StoreDto, CustomerDto, OrderDto } from './common.dto';

export class OrderListingDto extends OrderDto {
  @ApiProperty({
    description: 'The store information where the order was placed',
    type: StoreDto,
  })
  @Expose()
  store: StoreDto;

  @ApiProperty({
    description: 'The customer information who placed the order',
    type: CustomerDto,
  })
  @Expose()
  customer: CustomerDto;
}
