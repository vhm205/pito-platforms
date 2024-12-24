import { NullableType } from '@app/common/types/common';
import type { FindOptionsWhere } from 'typeorm';

import { Operator } from '../../domain/operator.domain';

import { OperatorEntity } from './relational/entities/operator.entity';

export abstract class OperatorRepository {
  abstract findOne(
    filter: FindOptionsWhere<Pick<OperatorEntity, 'id' | 'email'>>,
  ): Promise<NullableType<Operator>>;
}
