import type { TransformFnParams } from 'class-transformer';

export function transformArrayStringToNumber(params: TransformFnParams) {
  if (!params.value) return null;

  const value = params.value;
  if (Array.isArray(value)) {
    return value.map((v: string) => +v);
  } else if (!isNaN(value)) {
    return [parseInt(value)];
  }

  return null;
}
