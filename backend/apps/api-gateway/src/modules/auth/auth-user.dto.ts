import { ApiProperty } from '@nestjs/swagger';

import { ClientRole, AuthenticatedUser } from './auth-user.interface';

export class ClientRoleDto implements ClientRole {
  @ApiProperty({
    description: 'Unique identifier of the role',
    example: '9ed87855-c509-4fc6-9fa8-e0445c7eb1a5',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the role',
    example: 'app-customer',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the role',
    example: 'Customer role',
  })
  description: string;

  @ApiProperty({
    description: 'Indicates if the role is composite',
    example: false,
  })
  composite: boolean;

  @ApiProperty({
    description: 'Indicates if the role is a client role',
    example: true,
  })
  clientRole: boolean;

  @ApiProperty({
    description: 'The container ID associated with the role',
    example: '4f6a1736-17e1-46fa-8563-c1746c422f96',
  })
  containerId: string;
}

export class AuthenticatedUserDto implements AuthenticatedUser {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'b44bee9b-66c6-406c-a56c-22b5063d54e0',
  })
  id: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'tuan.nguyen@pito.vn',
  })
  email: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'Tuấn',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Nguyễn Ngọc Minh',
  })
  lastName: string;

  @ApiProperty({
    description: 'List of roles associated with the user',
    type: [ClientRoleDto],
    example: [
      {
        id: '9ed87855-c509-4fc6-9fa8-e0445c7eb1a5',
        name: 'app-customer',
        description: 'Customer role',
        composite: false,
        clientRole: true,
        containerId: '4f6a1736-17e1-46fa-8563-c1746c422f96',
      },
    ],
  })
  roles: ClientRoleDto[];
}
