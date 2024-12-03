import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CustomerDto {
  @ApiProperty({
    type: String,
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    description: 'The unique identifier of the customer',
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'The name of the customer',
  })
  @Expose()
  name: string;

  @ApiProperty({
    type: String,
    example: '84353448767',
    description: 'The phone number of the customer',
  })
  phone: string;

  @ApiProperty({
    type: String,
    example: 'quang.tran@pito.vn',
    description: 'The email of the customer',
  })
  email: string;
}
