import { NullableType } from '@app/common/types/common';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { RolePermissionEntity } from './role-permission.entity';

@Entity({ name: 'permissions' })
export class PermissionEntity {
  @PrimaryColumn({ type: 'text' })
  permission: string;

  @Column({ type: 'text', nullable: true })
  description: NullableType<string>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  name: NullableType<string>;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: NullableType<Date>;

  @OneToMany(() => RolePermissionEntity, rolePermission => rolePermission.permissionObject)
  rolePermissions: RolePermissionEntity[];
}
