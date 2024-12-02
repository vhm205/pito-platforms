import { CUSTOMER_DB_SOURCE } from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionRepository } from '../transaction.repository';

import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRelationalRepository } from './repositories/transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity], CUSTOMER_DB_SOURCE)],
  providers: [
    {
      provide: TransactionRepository,
      useClass: TransactionRelationalRepository,
    },
  ],
  exports: [TransactionRepository],
})
export class RelationalTransactionPersistenceModule {}
