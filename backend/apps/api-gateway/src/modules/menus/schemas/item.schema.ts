import { capitalize, capitalizeFirstLetter } from '@app/common';
import { ItemStatus, PackagingType, UnitType } from '@app/common/enums/item';
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
  type: z.string().optional(),
  maxQuantity: z.number().optional(),
  maxChoices: z.number().int().min(0),
  allowMultipleSelection: z.boolean(),
  allowQuantitySelection: z.boolean(),
});

export const ItemSchema = z.object({
  storeId: z.string().uuid(),
  menuCategory: z.string().uuid(),
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
  orderDeadlineAt: z.string().datetime().optional().nullable(),
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
  packagingType: z
    .union([
      z.literal(PackagingType.PAPER),
      z.literal(PackagingType.BAGASSE),
      z.literal(PackagingType.PLASTIC_FOAM),
      z.literal(PackagingType.ALUMINUM_TRAY),
      z.literal(PackagingType.REUSABLE_PACKAGING),
      z.literal(PackagingType.GLASS),
    ])
    .optional(),
  packagingUnit: z
    .union([
      z.literal(UnitType.BOTTLE),
      z.literal(UnitType.SET),
      z.literal(UnitType.PART),
      z.literal(UnitType.BOX),
      z.literal(UnitType.TRAY),
    ])
    .optional(),
  optionsChoices: z.array(OptionChoicesSchema),
  metadata: z.object({
    hasNotes: z.boolean(),
    hasUtensils: z.boolean(),
    rejectionReason: z.string().optional(),
    diningTools: z.array(z.string()).optional().default([]),
    hasFeedingService: z.boolean().optional(),
  }),
  serviceType: z.number().int().min(1).max(3).optional().default(1),
  serviceSettings: z
    .object({
      setupTime: z.number().int().min(0).optional().default(0),
      serviceTime: z.number().int().min(0).optional().default(0),
      servicePerson: z.number().int().min(0).optional().default(0),
    })
    .optional()
    .default({ setupTime: 0, serviceTime: 0, servicePerson: 0 }),
});

export const InsertItemSchema = ItemSchema;

export const UpdateItemSchema = ItemSchema.partial().refine(d => Object.keys(d).length > 0, {
  message: 'At least one field must be updated',
});
