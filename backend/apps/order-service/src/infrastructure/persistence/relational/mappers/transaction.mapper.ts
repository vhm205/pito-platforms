import { Transaction } from 'apps/order-service/src/domain/transaction';
import { filter, flatMap, forOwn, get, isEmpty } from 'lodash';

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

    if (raw.metadata) {
      const transactions = extractTransactions(raw.metadata);
      const transactionsWithEntityAttribute = flatMap(transactions, transaction =>
        filter(transaction, transaction => !isEmpty(transaction.transactionEntityAttribute)),
      );

      for (const transaction of transactionsWithEntityAttribute) {
        const entityAttribute = transaction.transactionEntityAttribute;
        domain.bankAccountName = get(entityAttribute, 'issuerBankName', null);
        domain.bankAccountNumber = get(entityAttribute, 'remitterAccountNumber', null);
        domain.bankAccountHolder = get(entityAttribute, 'remitterName', null);
      }
    }

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

function extractTransactions(metadata: Record<string, any>) {
  const transactions: Array<Record<string, any>> = [];

  forOwn(metadata, value => {
    if (value.requestParameters) {
      transactions.push(get(value, 'requestParameters.request.requestParams.transactions', []));
    }
  });

  return transactions;
}
