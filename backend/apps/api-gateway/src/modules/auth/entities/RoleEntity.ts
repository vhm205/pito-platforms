import { Entity, Column, PrimaryColumn, ManyToMany } from 'typeorm';

import { UserEntity } from './UserEntity';

@Entity('keycloak_role')
export class RoleEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ name: 'realm_id' })
  realmId: number;

  @ManyToMany(() => UserEntity, user => user.roles)
  users: UserEntity[];
}
