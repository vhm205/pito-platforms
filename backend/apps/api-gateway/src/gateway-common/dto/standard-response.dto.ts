import { ApiProperty } from '@nestjs/swagger';

export class StandardResponseWrapper<T> {
  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({ description: 'Additional information about the request', example: 'Success' })
  message: string;

  @ApiProperty({ description: 'Status code of the response', example: 200 })
  statusCode: number;
}
