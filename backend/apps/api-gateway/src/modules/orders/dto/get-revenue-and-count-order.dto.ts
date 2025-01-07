import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetRevenueAndCountOrderQueryDto {
  @ApiProperty({
    description: 'Array of store IDs',
    type: [String],
    example: ['80f48c91-bb2e-47d3-aed6-b2586f221be1', '93d48771-0d88-450d-bec6-efd008ea8677'],
    required: true,
  })
  @IsUUID('4', { each: true }) // Validate each element in the array as UUID v4
  storeIds: string[];
}

export class GetRevenueAndCountOrderResponseDto {
  @ApiProperty({ example: '80f48c91-bb2e-47d3-aed6-b2586f221be1' })
  storeId: string;

  @ApiProperty({ example: 10 })
  totalOrders: number;

  @ApiProperty({ example: 1250.5 })
  totalRevenue: number;
}
