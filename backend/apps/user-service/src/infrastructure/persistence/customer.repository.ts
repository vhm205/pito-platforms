import { NullableType } from '@app/common/types/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { CustomerEntity } from 'apps/user-service/src/infrastructure/persistence/relational/entities/customer.entity';
import type { FindOperator, FindOptionsWhere } from 'typeorm';

import { Company } from '../../domain/company.domain';
import { Customer } from '../../domain/customer.domain';

export abstract class CustomerRepository {
  abstract findOne(
    filter: FindOptionsWhere<Pick<CustomerEntity, 'id' | 'email'>>,
  ): Promise<NullableType<Customer>>;

  abstract findAndCount(args: {
    filters: Record<string, FindOperator<unknown>>[];
    pagination: PaginationRequest;
    sorts: SortRule[];
  }): Promise<[Customer[], number]>;

  abstract findAndCountCompanies(args: {
    filters: Record<string, FindOperator<unknown>>[];
    pagination: PaginationRequest;
    sorts: SortRule[];
  }): Promise<[Company[], number]>;
}
