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

  @ApiProperty({ type: () => [OccasionEventsResponse] })
  occationEvents: OccasionEventsResponse[];
}
