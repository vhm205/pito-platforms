import { FilterRule } from '@app/common/types/proto/common';

export function transformFilterOnboarding(f: FilterRule) {
  if (f.column === 'search') f.column = 'businessName';

  return f;
}
