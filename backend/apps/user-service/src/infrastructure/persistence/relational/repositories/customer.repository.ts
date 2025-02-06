import { CUSTOMER_DB_SOURCE } from '@app/common';
import { PaginationRequest, SortRule } from '@app/common/types/proto/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'apps/user-service/src/domain/company.domain';
import { Customer } from 'apps/user-service/src/domain/customer.domain';
import { FindOperator, type FindOptionsWhere, type Repository } from 'typeorm';

import { CustomerRepository } from '../../customer.repository';
import { CompanyEntity } from '../entities/company.entity';
import { CustomerEntity } from '../entities/customer.entity';
import { CompanyMapper } from '../mappers/company.mapper';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class CustomerRelationalRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity, CUSTOMER_DB_SOURCE)
    private customerRepository: Repository<CustomerEntity>,

    @InjectRepository(CompanyEntity, CUSTOMER_DB_SOURCE)
    private companyRepository: Repository<CompanyEntity>,
  ) {}

  async findOne(filter: FindOptionsWhere<Pick<CustomerEntity, 'id' | 'email'>>) {
    const entity = await this.customerRepository.findOne({ where: filter });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findAndCount(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Customer[], number]> {
    const { pagination, sorts, filters } = options;
    const [entities, total] = await this.customerRepository.findAndCount({
      skip: (pagination.currentPage - 1) * pagination.pageSize,
      take: pagination.pageSize,
      where: filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
      order: Object.fromEntries(sorts.map(sort => [sort.column, sort.direction])),
    });
    const domainEntities = entities.map(CustomerMapper.toDomain);
    return [domainEntities, total];
  }

  async findAndCountCompanies(options: {
    pagination: PaginationRequest;
    filters: Record<string, FindOperator<unknown>>[];
    sorts: SortRule[];
  }): Promise<[Company[], number]> {
    const { pagination, sorts, filters } = options;
    const [entities, total] = await this.companyRepository.findAndCount({
      skip: (pagination.currentPage - 1) * pagination.pageSize,
      take: pagination.pageSize,
      where: filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
      order: Object.fromEntries(sorts.map(sort => [sort.column, sort.direction])),
    });
    const domainEntities = entities.map(CompanyMapper.toDomain);
    return [domainEntities, total];
  }
}
