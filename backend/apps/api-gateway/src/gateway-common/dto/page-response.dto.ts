import { ApiProperty } from '@nestjs/swagger';

import { PageDto } from './page.dto';

export class PageResponseWrapper<T> extends PageDto<T> {
  @ApiProperty({ description: 'Additional information about the request', example: 'Success' })
  message: string;

  @ApiProperty({ description: 'Status code of the response', example: 200 })
  statusCode: number;
}
