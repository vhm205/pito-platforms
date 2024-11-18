import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @ApiProperty({
    isArray: true,
    description: 'The list of data items',
  })
  readonly data: T[];

  @ApiProperty({
    type: PageMetaDto,
    description: 'Metadata about the pagination',
  })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
