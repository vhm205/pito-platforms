import { OrderType } from '@app/common/enums';

export class OperatorOrderFilterDto {
  search: string;
  status: string;
  deliveryDate: string;
  orderType: OrderType;
}

export class UserOrderHistoryDto {
  status: string;
  storeId: string;
  userId: string;
}
