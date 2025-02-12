import { AuthenticatedUser } from '@gateway/modules/auth/auth-user.interface';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class PartnerGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;
    const { partner_id: partnerId } = request.query;

    if (!partnerId) {
      throw new ForbiddenException('Partner ID is required.');
    }

    const hasAccess = await this.authService.validateUserExistsInPartner(user.id, partnerId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this partner.');
    }

    return true;
  }
}
