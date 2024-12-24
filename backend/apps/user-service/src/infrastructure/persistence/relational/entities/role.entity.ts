import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

import { RolePermissionEntity } from './role-permission.entity';
import { UserRoleEntity } from './user-role.entity';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryColumn({ type: 'text' })
  role: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  name: string;

  @OneToMany(() => UserRoleEntity, userRole => userRole.roleObject)
  userRoles: UserRoleEntity[];

  @OneToMany(() => RolePermissionEntity, rolePermission => rolePermission.roleObject)
  rolePermissions: RolePermissionEntity[];
}
