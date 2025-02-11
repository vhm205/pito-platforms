import { ServiceType } from '@app/common/enums/partner';
import { NullableType, ObjectType } from '@app/common/types/common';

export class StoreService {
  storeId: string;
  serviceType: ServiceType;
  isActive: boolean;
  minOrderPrice: NullableType<number>;
  minPreorderTime: NullableType<number>;
  dailyOrderLimit: NullableType<number>;
  dailyRevenueLimit: NullableType<number>;
  reopenTime: NullableType<Date>;
  shippingFeeSettings: NullableType<ObjectType>;

  toMessage() {
    return {
      storeId: this.storeId,
      serviceType: this.serviceType,
      isActive: this.isActive,
      minOrderPrice: this.minOrderPrice,
      minPreorderTime: this.minPreorderTime,
      dailyOrderLimit: this.dailyOrderLimit,
      dailyRevenueLimit: this.dailyRevenueLimit,
      reopenTime: this.reopenTime,
      shippingFeeSettings: this.shippingFeeSettings,
    };
  }
}
