import { FilterOption, PartnerItem } from '@app/common';
import { ItemStatus } from '@app/common/enums/item';
import { InsertItemSchema } from '@gateway/modules/menus/schemas/item.schema';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export type InsertItemDto = z.infer<typeof InsertItemSchema>;

export class PartnerItemDto implements PartnerItem {
  @ApiProperty({
    description: 'ID',
    type: 'string',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @ApiProperty({
    description: 'Name',
    type: 'string',
    example: 'Example Name',
  })
  name: string;

  @ApiProperty({
    description: 'Base Price',
    type: 'number',
    example: 100,
  })
  basePrice: number;

  @ApiProperty({
    description: 'Description',
    type: 'string',
    example: 'Example Description',
  })
  description: string;

  @ApiProperty({
    description: 'Menu ID',
    type: 'string',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  menuId: string;

  @ApiProperty({
    description: 'Menu category',
    type: 'string',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  menuCategory: string;

  @ApiProperty({
    description: 'Slug',
    type: 'string',
    example: 'example-slug',
  })
  slug: string;

  @ApiProperty({
    description: 'Store ID',
    type: 'string',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  storeId: string;

  @ApiProperty({
    description: 'Catering Packages',
    type: 'number',
    example: [1, 2, 3],
  })
  cateringPackages: number[];

  @ApiProperty({
    description: 'Cuisine Types',
    type: 'array',
    example: [
      { id: 1, name: 'Italian' },
      { id: 2, name: 'Chinese' },
    ],
  })
  cuisineTypes: FilterOption[];

  @ApiProperty({
    description: 'Special Dietaries',
    type: 'array',
    example: [
      { id: 1, name: 'Vegetarian' },
      { id: 2, name: 'Vegan' },
    ],
  })
  specialDietaries: FilterOption[];

  @ApiProperty({
    description: 'Occasion Events',
    type: 'array',
    example: [
      { id: 1, name: 'Birthday' },
      { id: 2, name: 'Anniversary' },
    ],
  })
  occasionEvents: FilterOption[];

  @ApiProperty({
    description: 'Images',
    type: 'array',
    example: ['https://example.com/image1.jpg'],
  })
  images: string[];

  @ApiProperty({
    description: 'Min Quantity',
    type: 'number',
    example: 1,
  })
  minQuantity: number;

  @ApiProperty({
    description: 'Participant',
    type: 'number',
    example: 1,
  })
  participant: number;

  @ApiProperty({
    description: 'Preparation Time',
    type: 'number',
    example: 30,
  })
  preparationTime: number;

  @ApiProperty({
    description: 'Packaging Type',
    type: 'string',
    example: 'PAPER',
  })
  packagingType: string;

  @ApiProperty({
    description: 'Packaging Unit',
    type: 'string',
    example: 'BOTTLE',
  })
  packagingUnit: string;

  @ApiProperty({
    description: 'Options Choices',
    type: 'array',
    example: [],
  })
  optionsChoices: any[];

  @ApiProperty({
    description: 'Status',
    type: 'string',
    example: 'DRAFT',
  })
  status: ItemStatus;

  @ApiProperty({
    description: 'Metadata',
    type: 'object',
    example: {
      hasNotes: true,
      hasUtensils: true,
      rejectionReason: 'Example Reject Reason',
    },
    additionalProperties: true,
  })
  metadata: {
    hasNotes: boolean;
    hasUtensils: boolean;
    rejectionReason?: string;
  };

  @ApiProperty({
    description: 'Order Deadline At',
    type: String,
    example: '2021-01-01T00:00:00.000Z',
  })
  orderDeadlineAt: string;
}
