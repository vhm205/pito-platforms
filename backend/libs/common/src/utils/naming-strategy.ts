import { camelCase } from 'typeorm/util/StringUtils';

export function transformToCamelCase<T>(obj: Record<string, any>) {
  return Object.keys(obj).reduce((acc, key) => {
    const camelCaseKey = camelCase(key);
    acc[camelCaseKey] = obj[key];
    return acc;
  }, {} as T);
}
