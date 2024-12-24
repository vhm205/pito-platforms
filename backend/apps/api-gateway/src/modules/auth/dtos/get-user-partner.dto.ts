import { ApiProperty } from '@nestjs/swagger';

export class GetUserPartnerResponseDto {
  @ApiProperty({ description: 'User ID (UUID)', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ description: 'Full name of the user', example: 'John Doe', required: false })
  fullName: string | null;

  @ApiProperty({ description: 'Email of the user', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+15551234567',
    required: false,
  })
  phone: string | null;

  @ApiProperty({
    description: "URL of the user's avatar image",
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatarUrl: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
    example: '2023-10-27T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    type: String,
    format: 'date-time',
    example: '2023-10-27T11:30:00Z',
    required: false,
  })
  updatedAt: Date | null;

  @ApiProperty({
    description: 'Roles assigned to the user',
    example: ['admin:operator', 'store:owner'],
    type: [String],
    required: false,
  })
  roles?: string[];
}
