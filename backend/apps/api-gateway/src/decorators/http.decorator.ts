import { PartnerGuard } from '@gateway/guards/partner.guard';
import { StoreGuard } from '@gateway/guards/store.guard';
import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import type { RoleType } from '../constants';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';

import { PublicRoute } from './public-route.decorator';
import { Roles } from './roles.decorator';

export function Auth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    Roles(roles),
    UseGuards(AuthGuard({ public: isPublicRoute }), RolesGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute),
  );
}

export function PartnerAuth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    Roles(roles),
    UseGuards(AuthGuard({ public: isPublicRoute }), RolesGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    UseGuards(PartnerGuard),
    ApiQuery({
      name: 'partner_id',
      type: String,
      description: 'Partner ID',
      required: true,
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
    PublicRoute(isPublicRoute),
  );
}

export function StoreAuth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    Roles(roles),
    UseGuards(AuthGuard({ public: isPublicRoute }), RolesGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    UseGuards(StoreGuard),
    ApiQuery({
      name: 'store_id',
      type: String,
      description: 'Store ID',
      required: true,
      example: '123e4567-e89b-12d3-a456-426614174111',
    }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
    PublicRoute(isPublicRoute),
  );
}
