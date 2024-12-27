import { CUSTOMER_DB_SOURCE } from '@app/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'apps/order-service/src/domain/transaction';
import { map, reduce } from 'lodash';
import { FindOperator, Repository } from 'typeorm';

import { TransactionRepository } from '../../transaction.repository';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class TransactionRelationalRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity, CUSTOMER_DB_SOURCE)
    private readonly repository: Repository<TransactionEntity>,
  ) {}

  async findTransactionsWithPagination(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Transaction[], number]> {
    const { pagination, sorts, filters } = options;

    const [entities, total] = await this.repository.findAndCount({
      skip: (pagination.currentPage - 1) * pagination.pageSize,
      take: pagination.pageSize,
      where: reduce(filters, (acc, filter) => ({ ...acc, ...filter }), {}),
      order: Object.fromEntries(map(sorts, sort => [sort.column, sort.direction])),
    });

    const domainEntities = entities.map(TransactionMapper.toDomain);
    return [domainEntities, total];
  }
}
