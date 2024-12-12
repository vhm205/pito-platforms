import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, Min } from 'class-validator';

import { PageOptionsDto } from './page-options.dto';

interface IPageMetaDtoParameters {
  pageOptions: PageOptionsDto;
  totalCount: number;
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
  readonly pageSize: number;

  @ApiProperty({
    description: 'Total number of items',
    type: Number,
  })
  @IsInt()
  readonly total: number;

  @ApiProperty({
    description: 'Total number of pages',
    type: Number,
  })
  @IsInt()
  readonly totalPages: number;

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

  constructor({ pageOptions, totalCount }: IPageMetaDtoParameters) {
    this.page = pageOptions.page;
    this.pageSize = pageOptions.pageSize;
    this.total = totalCount;
    this.totalPages = Math.ceil(this.total / this.pageSize);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.totalPages;
  }
}
