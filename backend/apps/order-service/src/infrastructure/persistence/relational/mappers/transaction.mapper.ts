import { Transaction } from 'apps/order-service/src/domain/transaction';

import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionMapper {
  static toDomain(raw: TransactionEntity): Transaction {
    const domain = new Transaction();

    domain.id = raw.id;
    domain.orderId = raw.orderId;
    domain.amount = raw.amount;
    domain.billCode = raw.billCode;
    domain.transactionCode = raw.txCode;
    domain.createdAt = raw.createdAt;
    domain.bankName = 'Implement this later';
    domain.bankAccountNumber = 'Implement this later';

    return domain;
  }

  static toPersistence(domain: Transaction): TransactionEntity {
    const entity = new TransactionEntity();

    entity.id = domain.id;
    entity.orderId = domain.orderId;
    entity.amount = domain.amount;
    entity.billCode = domain.billCode;
    entity.txCode = domain.transactionCode;
    entity.createdAt = domain.createdAt;

    return entity;
  }
}
