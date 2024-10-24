import { OrderStatus } from '@app/common/enums/order';
import { z } from 'zod';

export const getListOrderSchema = z.object({
  fromDate: z.string().date().optional(),
  toDate: z.string().date().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  keyword: z.string().optional(),
  deliveryDate: z.string().date().optional(),
});

export type GetListOrderDto = z.infer<typeof getListOrderSchema>;
