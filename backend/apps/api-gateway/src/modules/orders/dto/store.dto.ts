import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StoreDto {
  @ApiProperty({
    example: '13bbbcb0-89b2-4d5f-ae9f-aa8d98ad353d',
    description: 'The unique identifier of the store',
  })
  @Expose()
  id: string;

  @ApiProperty({ example: 'PITO VN', description: 'The name of the store' })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'pito-vn',
    description: 'The slug of the store',
  })
  @Expose()
  slug: string;
}
