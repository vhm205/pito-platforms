import { ObjectType } from '@app/common/types/common';
import { ApiProperty } from '@nestjs/swagger';

export class GetOperatorProfileResponseDto {
  @ApiProperty()
  id: string;

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
  })
  updatedAt: Date;

  @ApiProperty({ description: 'Name of the entity', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'Email of the entity', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({
    description: 'Phone number of the entity',
    example: '+15551234567',
    required: false,
  })
  phone: string | null;

  @ApiProperty({
    description: 'Metadata associated with the entity (JSON format)',
    type: 'object',
    additionalProperties: true,
    example: { field1: 'value1', field2: 123 },
  })
  metadata: ObjectType | null;

  @ApiProperty({
    description: 'URL of the avatar image',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatarUrl: string | null;

  @ApiProperty({ description: 'First name of the entity', example: 'John', required: false })
  firstName: string | null;

  @ApiProperty({ description: 'Last name of the entity', example: 'Doe', required: false })
  lastName: string | null;
}
