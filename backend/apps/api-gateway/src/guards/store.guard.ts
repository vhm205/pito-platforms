import { AuthenticatedUser } from '@gateway/modules/auth/auth-user.interface';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class StoreGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;
    const { store_id: storeId } = request.query;

    if (!storeId) {
      throw new ForbiddenException('Store ID is required.');
    }

    const hasAccess = await this.authService.validateUserExistsInStore(user.id, storeId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this store.');
    }

    return true;
  }
}
