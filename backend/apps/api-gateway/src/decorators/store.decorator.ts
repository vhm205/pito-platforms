import { AuthenticatedStore } from '@gateway/modules/auth/auth-user.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Store = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { store_id: storeId } = request.query;

  if (!storeId) {
    throw new Error('Store ID is required.');
  }

  const store = request.store;

  if (!store) {
    throw new Error(`Store not found for ID: ${storeId}`);
  }

  return store as AuthenticatedStore;
});
