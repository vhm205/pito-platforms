import {
  Any,
  ArrayContainedBy,
  ArrayContains,
  ArrayOverlap,
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

import { FilterRule } from '../types/proto/common';

export function transformFilterRule(filter: FilterRule) {
  const { column, value, operator } = filter;
  switch (operator) {
    case 'eq':
      return { [column]: Equal(value) };
    case 'neq':
      return { [column]: Not(value) };
    case 'lt':
      return { [column]: LessThan(value) };
    case 'lte':
      return { [column]: LessThanOrEqual(value) };
    case 'gt':
      return { [column]: MoreThan(value) };
    case 'gte':
      return { [column]: MoreThanOrEqual(value) };
    case 'like':
      return { [column]: Like(`%${value}%`) };
    case 'ilike':
      return { [column]: ILike(`%${value}%`) };
    case 'btw':
      const [start, end] = value.split(',').map(v => v.trim());
      return { [column]: Between(start, end) };
    case 'in':
      return {
        [column]: In(value.split(',').map(v => v.trim())),
      };
    case 'any':
      return { [column]: Any(value.split(',').map(v => v.trim())) };
    case 'is':
      switch (value) {
        case 'null':
          return { [column]: IsNull() };
        case 'not null':
          return { [column]: Not(IsNull()) };
        case 'true':
          return { [column]: Equal(true) };
        case 'false':
          return { [column]: Equal(false) };
        default:
          return {};
      }
    case 'cs':
      return { [column]: ArrayContains(value.split(',').map(v => v.trim())) };
    case 'cd':
      return { [column]: ArrayContainedBy(value.split(',').map(v => v.trim())) };
    case 'ov':
      return { [column]: ArrayOverlap(value.split(',').map(v => v.trim())) };
    default:
      return {};
  }
}
