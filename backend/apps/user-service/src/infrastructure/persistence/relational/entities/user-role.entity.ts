import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

import { RoleEntity } from './role.entity';

@Entity({ name: 'user_roles' })
export class UserRoleEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @PrimaryColumn({ name: 'role', type: 'text' })
  role: string;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role' })
  roleObject: RoleEntity;
}
