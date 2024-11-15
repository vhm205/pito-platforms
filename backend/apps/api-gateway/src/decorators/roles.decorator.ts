import { SetMetadata } from '@nestjs/common';

import type { RoleType } from '../constants';

export const Roles = (roles: RoleType[]) => SetMetadata('roles', roles);
