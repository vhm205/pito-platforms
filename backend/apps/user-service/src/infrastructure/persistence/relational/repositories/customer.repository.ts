import { CUSTOMER_DB_SOURCE } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, type Repository } from 'typeorm';

import { CustomerRepository } from '../../customer.repository';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class CustomerRelationalRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity, CUSTOMER_DB_SOURCE)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async findOne(filter: FindOptionsWhere<Pick<CustomerEntity, 'id' | 'email'>>) {
    const entity = await this.customerRepository.findOne({ where: filter });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }
}
