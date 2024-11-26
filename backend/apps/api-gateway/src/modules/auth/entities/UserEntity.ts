import { Column, Entity, ManyToMany, PrimaryColumn, JoinTable } from 'typeorm';

import { RoleEntity } from './RoleEntity';

@Entity({ name: 'user_entity' })
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column({ name: 'realm_id' })
  realmId: string;

  @Column({ name: 'email_constraint' })
  emailConstraint: string;

  @Column({ name: 'email_verified' })
  emailVerified: boolean;

  @Column()
  enabled: boolean;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  username: string;

  @Column({ name: 'created_timestamp' })
  createdTimestamp: number;

  @Column({ name: 'is_partner' })
  isPartner: boolean;

  @Column({ name: 'origin_supabase_email' })
  originSupabaseEmail: string;

  @ManyToMany(() => RoleEntity, role => role.users)
  @JoinTable({
    name: 'user_role_mapping',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[];
}
