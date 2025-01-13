import { ApiProperty } from '@nestjs/swagger';

class CateringPackageResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isActive: boolean;
}

class OccasionEventsResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isActive: boolean;
}

export class GetCateringPackageResponseDto {
  @ApiProperty({ type: () => [CateringPackageResponse] })
  cateringPackages: CateringPackageResponse[];
}

export class GetCateringPackageAndOccasionEventResponseDto {
  @ApiProperty({ type: () => [CateringPackageResponse] })
  cateringPackages: CateringPackageResponse[];

  @ApiProperty({ type: () => [OccasionEventsResponse] })
  occationEvents: OccasionEventsResponse[];
}

export class CateringPackageOptionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Option Name' })
  name: string;

  @ApiProperty({ example: 'active' })
  status: string;
}

export class GetCateringPackageOptionsResponseDto {
  @ApiProperty({
    type: [CateringPackageOptionDto],
  })
  options: CateringPackageOptionDto[];
}
