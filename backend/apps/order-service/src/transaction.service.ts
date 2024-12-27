import { FindTransactionsRequest, transformFilterRule } from '@app/common';
import { Injectable } from '@nestjs/common';

import { TransactionRepository } from './infrastructure/persistence/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}
  async findTransactionsWithPagination({ pagination, filters, sorts }: FindTransactionsRequest) {
    return this.transactionRepository.findTransactionsWithPagination({
      pagination: pagination!,
      filters: filters.map(transformFilterRule),
      sorts,
    });
  }
}
