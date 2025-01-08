import { NullableType } from '@app/common/types/common';
import { CustomerEntity } from 'apps/user-service/src/infrastructure/persistence/relational/entities/customer.entity';
import type { FindOptionsWhere } from 'typeorm';

import { Customer } from '../../domain/customer.domain';

export abstract class CustomerRepository {
  abstract findOne(
    filter: FindOptionsWhere<Pick<CustomerEntity, 'id' | 'email'>>,
  ): Promise<NullableType<Customer>>;
}
