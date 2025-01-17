import { FilterOption, PartnerItem } from '@app/common';
import { ItemStatus } from '@app/common/enums/item';
import { InsertItemSchema } from '@gateway/modules/menus/schemas/item.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { z } from 'zod';

export type InsertItemDto = z.infer<typeof InsertItemSchema>;

export class PartnerItemDto implements PartnerItem {
  @ApiProperty({
    description: 'ID',
    type: 'string',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name',
    type: 'string',
    example: 'Example Name',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Base Price',
    type: 'number',
    example: 100,
  })
  @Expose()
  basePrice: number;

  @ApiProperty({
    description: 'Description',
    type: 'string',
    example: 'Example Description',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Menu ID',
    type: 'string',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @Expose()
  menuId: string;

  @ApiProperty({
    description: 'Menu category',
    type: 'string',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @Expose()
  menuCategory: string;

  @ApiProperty({
    description: 'Slug',
    type: 'string',
    example: 'example-slug',
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'Store ID',
    type: 'string',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @Expose()
  storeId: string;

  @ApiProperty({
    description: 'Catering Packages',
    type: 'number',
    example: [1, 2, 3],
  })
  @Expose()
  @Transform(({ value }) => value ?? [])
  cateringPackages: number[];

  @ApiProperty({
    description: 'Cuisine Types',
    type: 'array',
    example: [
      { id: 1, name: 'Italian' },
      { id: 2, name: 'Chinese' },
    ],
  })
  @Expose()
  @Transform(({ value }) => value ?? [])
  cuisineTypes: FilterOption[];

  @ApiProperty({
    description: 'Special Dietaries',
    type: 'array',
    example: [
      { id: 1, name: 'Vegetarian' },
      { id: 2, name: 'Vegan' },
    ],
  })
  @Expose()
  @Transform(({ value }) => value ?? [])
  specialDietaries: FilterOption[];

  @ApiProperty({
    description: 'Occasion Events',
    type: 'array',
    example: [
      { id: 1, name: 'Birthday' },
      { id: 2, name: 'Anniversary' },
    ],
  })
  @Expose()
  @Transform(({ value }) => value ?? [])
  occasionEvents: FilterOption[];

  @ApiProperty({
    description: 'Images',
    type: 'array',
    example: ['https://example.com/image1.jpg'],
  })
  @Expose()
  @Transform(({ value }) => value ?? [])
  images: string[];

  @ApiProperty({
    description: 'Min Quantity',
    type: 'number',
    example: 1,
  })
  @Expose()
  minQuantity: number;

  @ApiProperty({
    description: 'Participant',
    type: 'number',
    example: 1,
  })
  @Expose()
  participant: number;

  @ApiProperty({
    description: 'Preparation Time',
    type: 'number',
    example: 30,
  })
  @Expose()
  preparationTime: number;

  @ApiProperty({
    description: 'Packaging Type',
    type: 'string',
    example: 'PAPER',
  })
  @Expose()
  packagingType: string;

  @ApiProperty({
    description: 'Packaging Unit',
    type: 'string',
    example: 'BOTTLE',
  })
  @Expose()
  packagingUnit: string;

  @ApiProperty({
    description: 'Options Choices',
    type: 'array',
    example: [],
  })
  @Expose()
  @Transform(({ value }) => value ?? [])
  optionsChoices: any[];

  @ApiProperty({
    description: 'Status',
    type: 'string',
    example: 'DRAFT',
  })
  @Expose()
  status: ItemStatus;

  @ApiProperty({
    description: 'Metadata',
    type: 'object',
    example: {
      hasNotes: true,
      hasUtensils: true,
      rejectionReason: 'Example Reject Reason',
      hasFeedingService: true,
      diningTools: 'Example Dining Tools',
    },
    additionalProperties: true,
  })
  @Expose()
  metadata: {
    hasNotes: boolean;
    hasUtensils: boolean;
    rejectionReason?: string;
    hasFeedingService?: boolean;
    diningTools?: string;
  };

  @ApiProperty({
    description: 'Order Deadline At',
    type: String,
    example: '2021-01-01T00:00:00.000Z',
  })
  @Expose()
  orderDeadlineAt: string;

  @ApiProperty({
    description: 'Service Type',
    type: 'number',
    example: 1,
  })
  @Expose()
  serviceType: number;

  @ApiProperty({
    description: 'Service Settings',
    type: 'object',
    example: {
      setupTime: 10,
      servicePerson: 2,
      serviceTime: 30,
    },
    additionalProperties: true,
  })
  @Expose()
  serviceSettings: {
    setupTime: number;
    servicePerson: number;
    serviceTime: number;
  };

  @ApiProperty({
    type: String,
    example: 'abc-xyz',
  })
  @Expose()
  storeSlug: string;

  @ApiProperty({
    description: 'Version',
    type: 'number',
    example: 1,
  })
  @Expose()
  version: number;
}
