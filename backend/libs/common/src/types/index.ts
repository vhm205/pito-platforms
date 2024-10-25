export * from './proto/user';
// @ts-expect-error: FIX: Duplicate protoBufName
export * from './proto/billing';
// @ts-expect-error: FIX: Duplicate protoBufName
export * from './proto/order';

export * from './notification';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

export type KeyOfType<Entity, U> = {
  [P in keyof Required<Entity>]: Required<Entity>[P] extends U
    ? P
    : Required<Entity>[P] extends U[]
      ? P
      : never;
}[keyof Entity];
