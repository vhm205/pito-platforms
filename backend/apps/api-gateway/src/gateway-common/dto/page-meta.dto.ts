import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Min } from 'class-validator';

import { PageOptionsDto } from './page-options.dto';

interface IPageMetaDtoParameters {
  pageOptions: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  @ApiProperty({
    description: 'Current page number',
    type: Number,
  })
  @IsInt()
  @Min(1)
  readonly page: number;

  @ApiProperty({
    description: 'Number of items per page',
    type: Number,
  })
  @IsInt()
  @Min(1)
  readonly take: number;

  @ApiProperty({
    description: 'Total number of items',
    type: Number,
  })
  @IsInt()
  readonly itemCount: number;

  @ApiProperty({
    description: 'Total number of pages',
    type: Number,
  })
  @IsInt()
  readonly pageCount: number;

  @ApiProperty({
    description: 'Whether there is a previous page',
    type: Boolean,
  })
  @IsBoolean()
  readonly hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Whether there is a next page',
    type: Boolean,
  })
  @IsBoolean()
  readonly hasNextPage: boolean;

  constructor({ pageOptions, itemCount }: IPageMetaDtoParameters) {
    this.page = pageOptions.page;
    this.take = pageOptions.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
