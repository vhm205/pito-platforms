import { StoreOrder } from 'apps/order-service/src/domain';

import { StoreOrderEntity } from '../entities/store-order.entity';

export class StoreOrderMapper {
  static toDomain(raw: StoreOrderEntity): StoreOrder {
    const domain = new StoreOrder();

    domain.id = raw.id;
    domain.storeId = raw.storeId;
    domain.orderId = raw.orderId;
    domain.orderCode = raw.orderCode;

    domain.status = raw.status;
    domain.statusCode = raw.statusCode;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;
    domain.deliveryTime = raw.deliveryTime;
    domain.estimationTime = raw.estimationTime;

    domain.deliveryContact = raw.deliveryContact;
    domain.deliveryAddress = raw.deliveryAddress;

    domain.orderItems = raw.orderItems;
    domain.subtotalPrice = raw.subtotalPrice;
    domain.shippingFee = raw.shippingFee;
    domain.totalPrice = raw.totalPrice;
    domain.serviceFee = raw.serviceFee;
    domain.orderType = raw.orderType;

    domain.notes = raw.notes;
    domain.metadata = raw.metadata;
    domain.invoiceRequest = raw.invoiceRequest;
    domain.orderLogs = raw.orderLogs;

    return domain;
  }

  static toPersistence(domainEntity: StoreOrder): StoreOrderEntity {
    const entity = new StoreOrderEntity();

    if (domainEntity.id) entity.id = domainEntity.id;
    entity.storeId = domainEntity.storeId;
    entity.orderId = domainEntity.orderId;
    entity.orderCode = domainEntity.orderCode;

    entity.status = domainEntity.status;
    entity.statusCode = domainEntity.statusCode;
    entity.createdAt = domainEntity.createdAt;
    entity.updatedAt = domainEntity.updatedAt;
    entity.deliveryTime = domainEntity.deliveryTime;
    if (domainEntity.estimationTime) entity.estimationTime = domainEntity.estimationTime;

    entity.deliveryContact = domainEntity.deliveryContact;
    entity.deliveryAddress = domainEntity.deliveryAddress;

    entity.orderItems = domainEntity.orderItems;
    entity.subtotalPrice = domainEntity.subtotalPrice;
    entity.shippingFee = domainEntity.shippingFee;
    entity.totalPrice = domainEntity.totalPrice;
    entity.serviceFee = domainEntity.serviceFee;
    entity.orderType = domainEntity.orderType;

    entity.notes = domainEntity.notes;
    entity.metadata = domainEntity.metadata;
    entity.invoiceRequest = domainEntity.invoiceRequest;
    entity.orderLogs = domainEntity.orderLogs;

    return entity;
  }
}
