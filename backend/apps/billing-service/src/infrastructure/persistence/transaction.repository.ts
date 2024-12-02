import { NullableType } from '@app/common/types/common';
import type { FindOptionsWhere } from 'typeorm';

import { Transaction } from '../../domain/transaction.domain';

export abstract class TransactionRepository {
  abstract createTransaction(payload: Partial<Transaction>): Promise<NullableType<Transaction>>;
  abstract findOne(
    filter: FindOptionsWhere<Pick<Transaction, 'id' | 'orderId' | 'status' | 'txCode'>>,
  ): Promise<NullableType<Transaction>>;
  abstract updateTransaction(payload: Partial<Transaction>): Promise<NullableType<Transaction>>;
}
