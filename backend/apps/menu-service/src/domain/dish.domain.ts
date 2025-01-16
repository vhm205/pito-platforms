import { DishQuantityUnit } from '@app/common/enums/dish';
import { NullableType } from '@app/common/types/common';

export class Dish {
  id: string;
  name: string;
  quantity: NullableType<number>;
  quantityUnit: DishQuantityUnit;
  images: string[];
  storeId: string;
  partnerId: string;
  packageOptionId: NullableType<number>;
}
