import { Order } from '../../../../domain/order';
import { OrderEntity } from '../entities/order.entity';

export class OrderMapper {
  static toDomain(raw: OrderEntity): Order {
    const domain = new Order();

    domain.id = raw.orderId;
    domain.orderCode = raw.orderCode;
    domain.status = raw.status;

    return domain;
  }

  static toPersistence(domainEntity: Order): OrderEntity {
    const entity = new OrderEntity();

    entity.orderId = domainEntity.id;
    entity.orderCode = domainEntity.orderCode;

    return entity;
  }
}
