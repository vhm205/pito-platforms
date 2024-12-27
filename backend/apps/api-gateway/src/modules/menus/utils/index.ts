import { FilterRule } from '@app/common/types/proto/common';

export function transformFilterItem(f: FilterRule) {
  if (f.column === 'search') f.column = 'name';
  else if (f.column === 'status') {
    f.column = 'status';
  }

  return f;
}

export function normalizeArray<T>(value: T | T[]): T[] {
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
}
