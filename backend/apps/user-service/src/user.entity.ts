import { AbstractEntity } from '@app/common';
import { UseDto } from '@app/common/decorators/use-dto.decorator';
import { Column, Entity } from 'typeorm';

import { UserDto } from './user.dto';

@Entity({ name: 'users', schema: 'auth' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ unique: true, nullable: false, type: 'varchar' })
  id: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email: string | null;

  @Column({ nullable: true, type: 'varchar' })
  encrypted_password: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;
}
