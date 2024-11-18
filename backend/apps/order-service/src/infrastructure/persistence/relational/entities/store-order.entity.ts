import { EntityRelationalHelper } from '@app/common';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'store_orders' })
export class StoreOrderEntity extends EntityRelationalHelper {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

  @Column({ type: 'uuid', name: 'order_id' })
  orderId: string;
}
