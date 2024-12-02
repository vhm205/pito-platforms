import { CUSTOMER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'apps/billing-service/src/domain/transaction.domain';
import type { FindOptionsWhere, Repository } from 'typeorm';

import { TransactionRepository } from '../../transaction.repository';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class TransactionRelationalRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity, CUSTOMER_DB_SOURCE)
    private txRepository: Repository<TransactionEntity>,
  ) {}

  async createTransaction(payload: Transaction): Promise<NullableType<Transaction>> {
    const entity = await this.txRepository.save(TransactionMapper.toPersistence(payload));
    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async findOne(
    filter: FindOptionsWhere<Pick<Transaction, 'id' | 'orderId' | 'status' | 'txCode'>>,
  ): Promise<NullableType<Transaction>> {
    const entity = await this.txRepository.findOne({ where: filter });
    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async updateTransaction(payload: Transaction): Promise<NullableType<Transaction>> {
    const entity = await this.txRepository.save(TransactionMapper.toPersistence(payload));
    return entity ? TransactionMapper.toDomain(entity) : null;
  }
}
