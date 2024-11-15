export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 3000; // 3 seconds delay between retries

export function calculateBackoff(retryCount: number, baseDelay = 1000, factor = 2): number {
  return baseDelay * Math.pow(factor, retryCount);
}
