import { ItemStatus } from '@app/common/enums/item';
import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import { InsertItemDto, PartnerItemDto } from '@gateway/modules/menus/dtos/insert-menu-item.dto';
import { UpdateItemDto } from '@gateway/modules/menus/dtos/update-menu-item.dto';
import { MenusService } from '@gateway/modules/menus/menus.service';
import { DraftBypassPipe } from '@gateway/modules/menus/pipes/draft-bypass.pipe';
import { InsertItemSchema, UpdateItemSchema } from '@gateway/modules/menus/schemas/item.schema';
// import { ZodValidationPipe } from '@gateway/pipes/zod-validation.pipe';
import { isValidUUID } from '@gateway/utils/common';
import { emptyPaginationResponse } from '@gateway/utils/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { omit, isEmpty } from 'lodash';

import { Auth } from '../../decorators/http.decorator';

import {
  GetCateringPackageOptionsResponseDto,
  GetCateringPackageResponseDto,
} from './dtos/get-catering-package.dto';
import { FindItemsQueryDto, FindItemsResponseDto } from './dtos/query-items.dto';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post(':menuId/items')
  @Auth([RoleType.PARTNER])
  @ApiWrapperResponse({ type: PartnerItemDto })
  async insertMenuItem(
    @Body(new DraftBypassPipe(InsertItemSchema)) dto: InsertItemDto,
    @Param('menuId') menuId: string,
  ) {
    const newItem = await this.menusService.insertMenuItem({
      ...dto,
      menuId,
    });

    return newItem;
  }

  @Put('items/:itemId')
  @Auth([RoleType.PARTNER])
  @ApiWrapperResponse({ type: PartnerItemDto })
  async updateMenuItem(
    @Body(new DraftBypassPipe(UpdateItemSchema)) dto: Partial<UpdateItemDto>,
    @Param('itemId') itemId: string,
  ) {
    const updatedItem = await this.menusService.updateMenuItem({
      ...dto,
      itemId,
    });

    return updatedItem;
  }

  @Get('items/:identifier')
  @Auth([RoleType.PARTNER])
  @ApiWrapperResponse({ type: PartnerItemDto })
  async getMenuItem(@Param('identifier') identifier: string) {
    const filterCriteria = isValidUUID(identifier) ? { id: identifier } : { slug: identifier };
    const item = await this.menusService.findItem(filterCriteria);
    const itemDto = plainToInstance(PartnerItemDto, item, { excludeExtraneousValues: true });
    const sanitizedItem = omit(itemDto, ['menuCategory', 'storeId', 'menuId']);

    return sanitizedItem;
  }

  @Get('catering-packages')
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: GetCateringPackageResponseDto })
  async getCateringPackages() {
    const result = await this.menusService.findAllCateringPackages();
    return result;
  }

  @Get('catering-packages/:packageId/options')
  @ApiOperation({ summary: 'Get catering package options by package ID' })
  @ApiParam({ name: 'packageId', description: 'ID of the catering package', type: 'integer' })
  @ApiWrapperResponse({
    description: 'Catering package options retrieved successfully',
    type: GetCateringPackageOptionsResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request: Invalid package ID' })
  async getCateringPackageOptions(
    @Param('packageId', ParseIntPipe) packageId: number,
  ): Promise<GetCateringPackageOptionsResponseDto> {
    const result = await this.menusService.findCateringPackageOptionsByPackageId(packageId);
    return result;
  }

  @Get('package-items')
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: FindItemsResponseDto })
  @ApiOperation({ summary: 'Find items by filters' })
  async findItemsByFilters(@Query() query: FindItemsQueryDto) {
    query.filters.push({
      column: 'status',
      operator: 'eq',
      value: ItemStatus.ACTIVE,
    });

    const { items, totalCount } = await this.menusService.findItemsWithFilters(query);
    const { page, pageSize } = query;

    if (isEmpty(items)) {
      return emptyPaginationResponse({
        page,
        pageSize,
        totalCount,
      });
    }

    const pageMeta = new PageMetaDto({
      pageOptions: { page, pageSize },
      totalCount,
    });

    return new PageDto(items, pageMeta);
  }
}
