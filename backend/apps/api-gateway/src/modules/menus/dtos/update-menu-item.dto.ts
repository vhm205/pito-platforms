import { UpdateItemSchema } from '@gateway/modules/menus/schemas/item.schema';
import { z } from 'zod';

export type UpdateItemDto = z.infer<typeof UpdateItemSchema>;
