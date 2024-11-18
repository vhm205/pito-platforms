import { AuthenticatedUser } from '@gateway/modules/auth/auth-user.interface';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { RoleType } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());

    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user) return false;

    return this.matchRoles(user, roles);
  }

  private matchRoles(user: AuthenticatedUser, roles: RoleType[]): boolean {
    return roles.some(role => user.roles?.map(role => role.name).includes(role));
  }
}
