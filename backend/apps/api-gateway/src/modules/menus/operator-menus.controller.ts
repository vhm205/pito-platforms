import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse, Auth } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import {
  BulkInsertItemsDto,
  PartnerItemDto,
} from '@gateway/modules/menus/dtos/insert-menu-item.dto';
import { FindMenuCategoryRequestDto, MenuCategoryDto } from '@gateway/modules/menus/dtos/item.dto';
import { OperatorQueryItemDto } from '@gateway/modules/menus/dtos/query-menu.dto';
import {
  BulkUpdateItemsStatusDto,
  BulkUpdateItemsStatusResponseDto,
  UpdateItemDto,
} from '@gateway/modules/menus/dtos/update-menu-item.dto';
import { MenusService } from '@gateway/modules/menus/menus.service';
import { OperatorMenusService } from '@gateway/modules/menus/operator-menus.service';
import { DraftBypassPipe } from '@gateway/modules/menus/pipes/draft-bypass.pipe';
import { UpdateItemSchema } from '@gateway/modules/menus/schemas/item.schema';
import { emptyPaginationResponse, isValidUUID } from '@gateway/utils/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { get, assign, isEmpty } from 'lodash';

import { AssignOptionsToPackageDto } from './dtos/assign-options-to-package.dto';
import { GetCateringPackageResponseDto } from './dtos/get-catering-package.dto';
import { OperatorQueryStoreItemDto } from './dtos/operator-query-store-item.dto';

@Controller('operator')
export class OperatorMenusController {
  constructor(
    private readonly service: OperatorMenusService,
    private readonly menusService: MenusService,
  ) {}

  @Get('/stores/:storeId/items')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiPageWrapperResponse({ type: PartnerItemDto })
  async getItems(@Query() query: OperatorQueryItemDto, @Param('storeId') storeId: string) {
    const store = await this.service.findStore(storeId);

    if (isEmpty(store)) {
      throw new NotFoundException('Store not found');
    }

    query.filters = [
      ...(query.filters || []),
      { column: 'storeId', operator: 'eq', value: storeId },
    ];

    const { items, totalCount } = await this.service.findItemsWithPagination(query);

    if (isEmpty(items)) {
      return emptyPaginationResponse({
        page: query.page,
        pageSize: query.pageSize,
        totalCount,
      });
    }

    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto(items, pageMeta);
  }

  @Put('items/:itemId')
  @Auth([RoleType.OPERATOR])
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
  @Auth([RoleType.OPERATOR])
  @ApiWrapperResponse({ type: PartnerItemDto })
  async getMenuItem(@Param('identifier') identifier: string) {
    const filterCriteria = isValidUUID(identifier) ? { id: identifier } : { slug: identifier };
    const item = await this.menusService.findItem(filterCriteria);
    const cateringPackages = await this.menusService.findCateringPackagesWithIds(
      item.cateringPackages,
    );

    const itemDto = plainToInstance(PartnerItemDto, assign(item, { cateringPackages }), {
      excludeExtraneousValues: true,
    });

    return itemDto;
  }

  @Get('store-items')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.OPERATOR])
  async getStoresAndItemsWithCateringPackage(@Query() query: OperatorQueryStoreItemDto) {
    query.pageSize = 1000; // currently no pagination
    const { data, totalCount } = await this.service.getStoresAndItemsWithCateringPackage(query);

    const pageMeta = new PageMetaDto({
      pageOptions: { page: query.page, pageSize: query.pageSize },
      totalCount,
    });

    return new PageDto(data, pageMeta);
  }

  @Get('catering-packages')
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: GetCateringPackageResponseDto })
  @Auth([RoleType.OPERATOR])
  async getCateringPackages() {
    const result = await this.menusService.findAllCateringPackages();
    return result;
  }

  @Get('catering-packages/items/total')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.OPERATOR])
  async getTotalCateringPackagesItems(@Query('serviceCategory') serviceCategory = 'PX') {
    const cateringPackages = await this.menusService.findActiveCateringPackages();
    if (isEmpty(cateringPackages)) return [];

    const packageIds = cateringPackages.map(c => c.id);
    const countResult = await this.service.countCateringPackagesItems(serviceCategory, packageIds);

    return cateringPackages.map(c => ({
      ...c,
      totalItems: get(countResult.data, c.id, 0),
    }));
  }

  @Post('catering-packages/:id/assign-options')
  @ApiOperation({ summary: 'Assign options to a package' })
  @ApiParam({ name: 'id', description: 'Package ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Options assigned successfully',
    schema: { example: { success: true } },
  })
  async assignOptionsToPackage(
    @Param('id') packageId: number,
    @Body() { optionIds }: AssignOptionsToPackageDto,
  ): Promise<{ success: boolean }> {
    return this.service.assignOptionsToPackage(packageId, optionIds);
  }

  @Post('items/bulk-insert')
  @Auth([RoleType.OPERATOR])
  @ApiOperation({ summary: 'Bulk insert items' })
  @ApiResponse({
    status: 201,
    description: 'Items inserted successfully',
    schema: { example: { data: { insertedCount: 10 }, message: 'Success', statusCode: 201 } },
  })
  @HttpCode(HttpStatus.CREATED)
  async bulkInsertItems(@Body() request: BulkInsertItemsDto) {
    const result = await this.service.bulkInsertItems(request);
    return result;
  }

  @Patch('items/status')
  @Auth([RoleType.OPERATOR])
  @ApiOperation({ summary: 'Bulk update items status' })
  @ApiWrapperResponse({
    type: BulkUpdateItemsStatusResponseDto,
    description: 'Bulk update items status',
  })
  @HttpCode(HttpStatus.OK)
  async bulkUpdateItemsStatus(@Body() request: BulkUpdateItemsStatusDto) {
    const result = await this.service.bulkUpdateItemsStatus(request);
    return result;
  }

  @Delete('items/:identifier')
  @ApiOperation({ summary: 'Delete a item by identifier' })
  @ApiParam({ name: 'identifier', description: 'Identifier of the item' })
  @ApiWrapperResponse({
    description: 'The item has been successfully deleted.',
    type: BulkUpdateItemsStatusResponseDto,
  })
  @Auth([RoleType.OPERATOR])
  async deleteItem(@Param('identifier') identifier: string) {
    const filterCriteria = isValidUUID(identifier) ? { id: identifier } : { slug: identifier };
    return this.service.deleteItem(filterCriteria);
  }

  @Get('menu-categories/:id')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  @ApiWrapperResponse({ type: MenuCategoryDto })
  async findMenuCategory(@Param('id') id: string, @Query() query: FindMenuCategoryRequestDto) {
    return this.service.findMenuCategory({
      id,
      serviceCategory: query?.serviceCategory,
    });
  }

  @Get('menus/setting-fees')
  @Auth([RoleType.OPERATOR])
  @HttpCode(HttpStatus.OK)
  async getSettingFees() {
    return this.menusService.getSettingFees();
  }
}
