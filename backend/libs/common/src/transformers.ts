export function snakeToCamel(str: string): string {
  return str.replace(/(_\w)/g, matches => matches[1].toUpperCase());
}

export function convertObjectKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => convertObjectKeysToCamelCase(item));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const camelKey = snakeToCamel(key);
      acc[camelKey] = convertObjectKeysToCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}
