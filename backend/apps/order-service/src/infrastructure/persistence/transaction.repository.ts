import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { FindOperator } from 'typeorm';

import { Transaction } from '../../domain/transaction';

export abstract class TransactionRepository {
  abstract findTransactionsWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Transaction[], number]>;
}
