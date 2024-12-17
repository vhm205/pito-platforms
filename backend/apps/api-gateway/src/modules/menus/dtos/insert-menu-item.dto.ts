import { capitalize, capitalizeFirstLetter, FilterOption, PartnerItem } from '@app/common';
import { PackagingType, ItemStatus, UnitType } from '@app/common/enums/item';
import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

const ChoiceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number().min(0).nullable().optional(),
});

const OptionChoicesSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  choices: z.array(ChoiceSchema),
  isRequired: z.boolean(),
  maxChoices: z.number().int().min(0),
  allowMultipleSelection: z.boolean(),
  allowQuantitySelection: z.boolean(),
});

export const ItemSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  menuId: z.string().uuid(),
  menuCategory: z.string().uuid(),
  slug: z.string(),
  cateringPackages: z.array(z.number()),
  cuisineTypes: z.array(z.number()).optional(),
  specialDietaries: z.array(z.number()).optional(),
  occasionEvents: z.array(z.number()).optional(),
  basePrice: z.number().min(0).optional(),
  name: z.string().transform(capitalize),
  description: z.string().transform(capitalizeFirstLetter).optional(),
  images: z.array(z.string()).optional(),
  minQuantity: z.number().int().min(1),
  participant: z.number().int().min(1),
  preparationTime: z.number().int().min(0),
  status: z
    .union([
      z.literal(ItemStatus.ACTIVE),
      z.literal(ItemStatus.INACTIVE),
      z.literal(ItemStatus.UNSTOCKED),
      z.literal(ItemStatus.PENDING_APPROVAL),
      z.literal(ItemStatus.REJECTED),
      z.literal(ItemStatus.APPROVED),
      z.literal(ItemStatus.DRAFT),
    ])
    .optional(),
  packagingType: z.union([
    z.literal(PackagingType.PAPER),
    z.literal(PackagingType.BAGASSE),
    z.literal(PackagingType.PLASTIC_FOAM),
    z.literal(PackagingType.ALUMINUM_TRAY),
    z.literal(PackagingType.REUSABLE_PACKAGING),
    z.literal(PackagingType.GLASS),
  ]),
  packagingUnit: z.union([
    z.literal(UnitType.BOTTLE),
    z.literal(UnitType.SET),
    z.literal(UnitType.PART),
    z.literal(UnitType.BOX),
    z.literal(UnitType.TRAY),
  ]),
  optionsChoices: z.array(OptionChoicesSchema),
  metadata: z.object({
    hasNotes: z.boolean(),
    hasUtensils: z.boolean(),
    rejectionReason: z.string().optional(),
  }),
  createdAt: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
});

export const InsertItemSchema = ItemSchema.omit({
  id: true,
  menuId: true,
  slug: true,
  cateringPackages: true,
  createdAt: true,
  updatedAt: true,
});

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
}
