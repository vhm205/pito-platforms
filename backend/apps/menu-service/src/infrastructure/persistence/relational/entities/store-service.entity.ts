import { ServiceType } from '@app/common/enums/partner';
import { NullableType } from '@app/common/types/common';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('store_services')
export class StoreServiceEntity {
  @PrimaryColumn({ name: 'store_id', type: 'uuid' })
  storeId: string;

  @PrimaryColumn({ name: 'service_type', type: 'enum', enum: ServiceType })
  serviceType: ServiceType;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'min_order_price', type: 'numeric', nullable: true })
  minOrderPrice: NullableType<number>;

  @Column({ name: 'min_preorder_time', type: 'numeric', nullable: true })
  minPreorderTime: NullableType<number>;

  @Column({ name: 'daily_order_limit', type: 'numeric', nullable: true })
  dailyOrderLimit: NullableType<number>;

  @Column({ name: 'daily_revenue_limit', type: 'numeric', nullable: true })
  dailyRevenueLimit: NullableType<number>;

  @Column({ name: 'reopen_time', type: 'timestamptz', nullable: true })
  reopenTime: NullableType<Date>;
}
