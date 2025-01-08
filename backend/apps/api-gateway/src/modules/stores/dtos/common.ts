import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class StoreLocationDto {
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
