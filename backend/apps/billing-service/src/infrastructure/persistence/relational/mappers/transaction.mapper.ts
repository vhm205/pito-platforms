import { Transaction } from 'apps/billing-service/src/domain/transaction.domain';

import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionMapper {
  static toDomain(raw: TransactionEntity): Transaction {
    const domain = new Transaction();
    domain.id = raw.id;
    domain.txCode = raw.txCode;
    domain.orderId = raw.orderId;
    domain.storeId = raw.storeId;
    domain.customerId = raw.customerId;
    domain.amount = +raw.amount;
    domain.description = raw.description;
    domain.status = raw.status;
    domain.paymentType = raw.payType;
    domain.paymentMethod = raw.method;
    domain.paymentGateway = raw.paymentGateway;
    domain.errorCode = raw.errorCode;
    domain.statusMessage = raw.statusMessage;
    domain.billCode = raw.billCode;
    domain.metadata = raw.metadata;
    domain.createdAt = raw.createdAt;
    return domain;
  }

  static toPersistence(domainEntity: Transaction): TransactionEntity {
    const entity = new TransactionEntity();
    entity.id = domainEntity.id;
    entity.txCode = domainEntity.txCode;
    entity.orderId = domainEntity.orderId;
    entity.storeId = domainEntity.storeId;
    entity.customerId = domainEntity.customerId;
    entity.amount = domainEntity.amount;
    entity.description = domainEntity.description;
    entity.status = domainEntity.status;
    entity.payType = domainEntity.paymentType;
    entity.method = domainEntity.paymentMethod;
    entity.paymentGateway = domainEntity.paymentGateway;
    entity.errorCode = domainEntity.errorCode;
    entity.statusMessage = domainEntity.statusMessage;
    entity.billCode = domainEntity.billCode;
    entity.metadata = domainEntity.metadata;
    entity.createdAt = domainEntity.createdAt;
    return entity;
  }
}
