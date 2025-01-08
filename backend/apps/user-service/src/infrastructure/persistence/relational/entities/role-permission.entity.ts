import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'role_permissions' })
export class RolePermissionEntity {
  @PrimaryColumn({ type: 'text' })
  role: string;

  @ManyToOne(() => RoleEntity, role => role.rolePermissions)
  @JoinColumn({ name: 'role' })
  roleObject: RoleEntity;

  @PrimaryColumn({ type: 'text' })
  permission: string;

  @ManyToOne(() => PermissionEntity)
  @JoinColumn({ name: 'permission' })
  permissionObject: PermissionEntity;
}
