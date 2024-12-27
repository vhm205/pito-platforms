import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export class CalculateDistanceRequestDto {
  @ApiProperty()
  @IsLatitude()
  latitude: number;

  @ApiProperty()
  @IsLongitude()
  longitude: number;

  @ApiProperty()
  @IsString()
  geolocation: string;
}

export class CalculateDistanceResponseDto {
  @ApiProperty()
  distance: number;
}
