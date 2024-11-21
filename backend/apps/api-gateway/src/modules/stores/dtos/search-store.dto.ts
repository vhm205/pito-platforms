import { SearchStoreResult, Store } from '@app/common';
import { PaginationQueryDto } from '@app/common/dto';
import { transformArrayStringToNumber } from '@gateway/utils/transformers';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumberString, IsNumber, IsDateString } from 'class-validator';

/**
 * [SEARCH-STORE] REQUEST DTO
 */
export class SearchStoreRequestDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  keyword: string;

  @IsString()
  @IsOptional()
  @IsDateString()
  shippingTime: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  rating: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  budgetMin: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  budgetMax: number;

  @IsString()
  @IsOptional()
  address: string;

  @IsNumberString()
  @IsOptional()
  latitude: number;

  @IsNumberString()
  @IsOptional()
  longitude: number;

  @IsOptional()
  @Transform(transformArrayStringToNumber)
  occasionEvents: number[];

  @IsOptional()
  @Transform(transformArrayStringToNumber)
  specialDietaries: number[];

  @IsOptional()
  @Transform(transformArrayStringToNumber)
  serviceTypes: number[];

  @IsOptional()
  @Transform(transformArrayStringToNumber)
  cuisineTypes: number[];
}

/**
 * [SEARCH-STORE] RESPONSE DTO
 */
export class OpeningHoursDto {
  @ApiProperty({ description: 'Opening time for a specific day, e.g., 09:00' })
  open: string;

  @ApiProperty({ description: 'Closing time for a specific day, e.g., 18:00' })
  close: string;
}

export class StoreDto implements Store {
  @ApiProperty({ type: String, description: 'The unique identifier for the store.' })
  id: string;

  @ApiProperty({ type: String, description: 'The partner ID associated with the store.' })
  partnerId: string;

  @ApiProperty({ type: String, description: 'The name of the store.' })
  storeName: string;

  @ApiProperty({ type: String, description: 'A brief introduction of the store.' })
  introduction: string;

  @ApiProperty({ type: String, description: 'Avatar image URL of the store.' })
  avatar: string;

  @ApiProperty({ type: String, description: 'Thumbnail image URL of the store.' })
  thumbnail: string;

  @ApiProperty({ type: String, description: 'Email address of the store.' })
  email: string;

  @ApiProperty({ type: String, description: 'Phone number of the store.' })
  phone: string;

  @ApiProperty({ type: Boolean, description: 'Status if the store is active or not.' })
  isActive: boolean;

  @ApiProperty({ type: Boolean, description: 'Indicates whether the store charges VAT.' })
  isVat: boolean;

  @ApiProperty({ type: Number, description: 'Star rating of the store.' })
  starRating: number;

  @ApiProperty({ type: Number, description: 'Rate of timeliness for the store.' })
  timelinessRate: number;

  @ApiProperty({ type: String, description: 'Cover image URL for the store.' })
  cover: string;

  @ApiProperty({ type: String, description: 'The status of the menu in the store.' })
  menuStatus: string;

  @ApiProperty({ type: [Number], description: 'List of cuisine types for the store.' })
  cuisineTypes: number[];

  @ApiProperty({ type: [Number], description: 'List of special dietary options for the store.' })
  specialDietaries: number[];

  @ApiProperty({ type: [Number], description: 'List of occasion events for the store.' })
  occasionEvents: number[];

  @ApiProperty({ type: [Number], description: 'List of service types for the store.' })
  serviceTypes: number[];

  @ApiProperty({
    type: Number,
    description: 'The minimum number of participants for an order.',
    nullable: true,
  })
  minParticipants: number;

  @ApiProperty({
    type: Number,
    description: 'The minimum preparation time for the store.',
    nullable: true,
  })
  minPreparationTime: number;

  @ApiProperty({
    type: Number,
    description: 'The minimum order value for the store.',
    nullable: true,
  })
  minOrderValue: number;

  @ApiProperty({ type: String, description: 'The store code.' })
  storeCode: string;

  @ApiProperty({ type: String, description: 'The store slug (URL-friendly name).' })
  slug: string;

  @ApiProperty({ type: String, description: 'The status of the store.', nullable: true })
  status: string;

  @ApiProperty({ type: Object, description: 'The opening hours of the store.', nullable: true })
  openingHours: { [key: string]: OpeningHoursDto };

  @ApiProperty({ type: Date, description: 'The last updated timestamp of the store.' })
  updatedAt: Date | undefined;
}

export class SearchStoreResponseDto implements SearchStoreResult {
  @ApiProperty({ type: StoreDto, description: 'Store details.' })
  store: StoreDto;

  @ApiProperty({
    type: Number,
    description: 'Distance from the user to the store.',
    nullable: true,
  })
  distance: number;

  @ApiProperty({ type: Number, description: 'Total completed orders for the store.' })
  totalCompletedOrders: number;

  @ApiProperty({ type: Boolean, description: 'Indicates if the store is currently open.' })
  isOpen: boolean;
}
