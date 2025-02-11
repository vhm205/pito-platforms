import { AuthenticatedPartner } from '@gateway/modules/auth/auth-user.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Partner = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { partner_id: partnerId } = request.query;

  if (!partnerId) {
    throw new Error('Partner ID is required.');
  }

  const partner = request.partner;

  if (!partner) {
    throw new Error(`Partner not found for ID: ${partnerId}`);
  }

  return partner as AuthenticatedPartner;
});
