import type { RetryOptions, RetryOperationParams } from './types/common';

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

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retryOperation<T>(
  operation: (params: RetryOperationParams) => Promise<T>,
  opts?: RetryOptions,
): Promise<T> {
  const maxRetries = opts?.maxRetries ?? 5;
  const backoff = opts?.backoff ?? 2;
  let delay = opts?.delay ?? 1000;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await operation({ attempt });
    } catch (error: any) {
      attempt++;
      console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms...`);

      if (attempt >= maxRetries) {
        console.error(`Operation failed after ${attempt} attempts.`);
        throw error;
      }

      // Wait before the next attempt, with optional backoff
      await wait(delay);

      // Apply exponential backoff for each retry
      delay *= backoff;
    }
  }
  throw new Error('Retry attempts exceeded');
}
