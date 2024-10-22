import { UseDto } from '@app/common/decorators/use-dto.decorator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

import { OrderDto } from '../dto/order.dto';

@Entity({ name: 'orders' })
@UseDto(OrderDto)
export class OrderEntity extends OrderDto {
  @PrimaryColumn({ name: 'id' })
  orderId: string;

  storeName: string;

  introduction: string;

  slug: string;

  thumbnail: string;

  avatar: string;

  @Column({ name: 'order_code', type: 'varchar', length: 50, unique: true })
  orderCode: string;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ name: 'note', type: 'text', nullable: true })
  note: string;

  @Column({ name: 'receiver_name', type: 'varchar', length: 255 })
  receiverName: string;

  @Column({ name: 'status', type: 'varchar', length: 50 })
  status: string;

  @Column({ name: 'error_code', type: 'int', nullable: true })
  errorCode: number;

  @Column({ name: 'payment_method', type: 'varchar', length: 50 })
  paymentMethod: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'delivery_date', type: 'timestamp' })
  deliveryDate: Date;

  @Column({ name: 'order_items', type: 'jsonb', nullable: true })
  orderItems: any;
}
