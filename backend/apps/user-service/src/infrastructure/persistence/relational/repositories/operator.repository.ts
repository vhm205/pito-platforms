import { CUSTOMER_DB_SOURCE } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, type Repository } from 'typeorm';

import { OperatorRepository } from '../../operator.repository';
import { OperatorEntity } from '../entities/operator.entity';
import { OperatorMapper } from '../mappers/operator.mapper';

@Injectable()
export class OperatorRelationalRepository implements OperatorRepository {
  constructor(
    @InjectRepository(OperatorEntity, CUSTOMER_DB_SOURCE)
    private operatorRepository: Repository<OperatorEntity>,
  ) {}

  async findOne(filter: FindOptionsWhere<Pick<OperatorEntity, 'id' | 'email'>>) {
    const entity = await this.operatorRepository.findOne({ where: filter });
    return entity ? OperatorMapper.toDomain(entity) : null;
  }
}
