import { Order } from 'apps/order-service/src/domain';
import { map } from 'lodash';

import { OrderEntity } from '../entities/order.entity';

export class OrderMapper {
  static toDomain(raw: OrderEntity): Order {
    const domain = new Order();

    domain.id = raw.id;
    // domain.partnerId = raw.partnerId!;
    domain.storeId = raw.storeId;
    domain.userId = raw.customerId;
    domain.orderType = raw.orderType;
    domain.orderCode = raw.orderCode;
    // Price-related columns
    domain.totalPrice = Number(raw.totalPrice);
    domain.subTotalPrice = Number(raw.subTotalPrice);
    domain.shippingFee = Number(raw.shippingFee);
    domain.discountAmount = Number(raw.discountAmount);
    domain.discountShippingFee = Number(raw.discountShippingFee);
    // Payment method field
    domain.paymentMethod = raw.paymentMethod;
    // Order status and related dates
    domain.status = raw.status;
    domain.statusCode = raw.statusCode;
    domain.operatorStatusCode = raw.operatorStatusCode;
    if (raw.deliveryAt) domain.deliveryAt = raw.deliveryAt;
    if (raw.completedAt) domain.completedAt = raw.completedAt;
    if (raw.cancelledAt) domain.cancelledAt = raw.cancelledAt;
    if (raw.preparedAt) domain.preparedAt = raw.preparedAt;
    if (raw.confirmedAt) domain.confirmedAt = raw.confirmedAt;
    // Delivery-related information
    domain.receiverName = raw.receiverName;
    domain.receiverPhone = raw.receiverPhone;
    domain.deliveryAddress = raw.deliveryAddress;
    // if (raw.deliveryTime) domain.deliveryTime = raw.deliveryTime;
    if (raw.deliveryEta) domain.deliveryEta = raw.deliveryEta;
    if (raw.trackingUrl) domain.trackingUrl = raw.trackingUrl;
    if (raw.deliveryDate) domain.deliveryDate = raw.deliveryDate;
    if (raw.deliveryFailedAt) domain.deliveryFailedAt = raw.deliveryFailedAt;
    // Cancellation and additional details
    if (raw.cancelReason) domain.cancelReason = raw.cancelReason;
    if (raw.deliveryLater !== null) domain.deliveryLater = raw.deliveryLater;
    if (raw.note) domain.note = raw.note;
    if (raw.vatInfo) domain.vatInfo = raw.vatInfo;
    if (raw.orderCount) domain.orderCount = raw.orderCount;
    if (raw.errorCode) domain.errorCode = raw.errorCode;
    if (raw.metadata) domain.metadata = raw.metadata;
    if (raw.receiverEmail) domain.receiverEmail = raw.receiverEmail;
    // Timestamps
    domain.createdAt = raw.createdAt;
    if (raw.updatedAt) domain.updatedAt = raw.updatedAt;
    domain.orderItems = map(raw.orderItems, item => ({
      totalPrice: item.totalPrice ?? item.price * item.quantity,
      quantity: item.quantity,
      notes: item.notes,
      item: {
        id: item.item.id,
        name: item.item.name,
        slug: item.item.slug,
        images: item.item.images,
        basePrice: item.item.base_price,
      },
    }));

    return domain;
  }

  static toPersistence(domainEntity: Order): OrderEntity {
    const entity = new OrderEntity();

    entity.id = domainEntity.id;
    // Business-related information
    entity.storeId = domainEntity.storeId;
    entity.customerId = domainEntity.userId;
    entity.orderType = domainEntity.orderType;
    entity.orderCode = domainEntity.orderCode;
    // Price-related columns
    entity.totalPrice = domainEntity.totalPrice;
    entity.subTotalPrice = domainEntity.subTotalPrice;
    entity.shippingFee = domainEntity.shippingFee;
    entity.discountAmount = domainEntity.discountAmount;
    entity.discountShippingFee = domainEntity.discountShippingFee;
    // Payment method field
    entity.paymentMethod = domainEntity.paymentMethod;
    // Order status and related dates
    entity.status = domainEntity.status;
    entity.statusCode = domainEntity.statusCode;
    entity.operatorStatusCode = domainEntity.operatorStatusCode;
    entity.deliveryAt = domainEntity.deliveryAt;
    entity.completedAt = domainEntity.completedAt;
    entity.cancelledAt = domainEntity.cancelledAt;
    entity.preparedAt = domainEntity.preparedAt;
    entity.confirmedAt = domainEntity.confirmedAt;
    // Delivery-related information
    entity.receiverName = domainEntity.receiverName;
    entity.receiverPhone = domainEntity.receiverPhone;
    entity.deliveryAddress = domainEntity.deliveryAddress;
    // entity.deliveryTime = domainEntity.deliveryTime;
    entity.deliveryEta = domainEntity.deliveryEta;
    entity.trackingUrl = domainEntity.trackingUrl;
    entity.deliveryDate = domainEntity.deliveryDate;
    entity.deliveryFailedAt = domainEntity.deliveryFailedAt;
    // Cancellation and additional details
    entity.cancelReason = domainEntity.cancelReason;
    entity.deliveryLater = domainEntity.deliveryLater;
    entity.note = domainEntity.note;
    entity.orderItems = domainEntity.orderItems ?? [];
    entity.vatInfo = domainEntity.vatInfo;
    entity.orderCount = domainEntity.orderCount;
    entity.errorCode = domainEntity.errorCode;
    entity.metadata = domainEntity.metadata;
    entity.receiverEmail = domainEntity.receiverEmail;

    entity.createdAt = domainEntity.createdAt;
    if (domainEntity.updatedAt) entity.updatedAt = domainEntity.updatedAt;

    return entity;
  }
}
