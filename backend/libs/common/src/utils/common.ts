import type { RetryOptions, RetryOperationParams } from '../types/common';

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
      // console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms...`);

      if (attempt >= maxRetries) {
        // console.error(`Operation failed after ${attempt} attempts.`);
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

export function getImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = process.env.BASE_URL;
  return `${baseUrl}/storage/v1/render/image/public/images/${imagePath}`;
}

export const getPublicImageURL = (bucket: string, path: string) => {
  if (!path || path?.startsWith('https')) return path ?? '';
  const baseUrl = process.env.STORAGE_URL!;
  return baseUrl.concat('/v1/object/public/', bucket, path);
};
