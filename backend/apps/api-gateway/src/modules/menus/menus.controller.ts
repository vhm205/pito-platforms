import { ItemStatus } from '@app/common/enums/item';
import { RoleType } from '@gateway/constants';
import { ApiPageWrapperResponse } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PageMetaDto } from '@gateway/gateway-common/dto/page-meta.dto';
import { PageDto } from '@gateway/gateway-common/dto/page.dto';
import {
  FilterOptionDto,
  InsertItemDto,
  PartnerItemDto,
} from '@gateway/modules/menus/dtos/insert-menu-item.dto';
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
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { omit, isEmpty } from 'lodash';

import { Auth } from '../../decorators/http.decorator';

import { DishesService } from './dish.service';
import {
  CreateDishDto,
  DeleteDishResponseDto,
  UpdateDishDto,
  UpdateDishResponseDto,
} from './dtos/mutation-dish.dto';
import { DishDto, FindDishesQueryDto, FindDishesResponseDto } from './dtos/query-dish.dto';
import { FindItemsQueryDto, FindItemsResponseDto } from './dtos/query-items.dto';

@Controller('menus')
export class MenusController {
  constructor(
    private readonly menusService: MenusService,
    private readonly dishesService: DishesService,
  ) {}

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

  /**
   * API CRUD Dishes
   */
  @Post('dishes')
  @ApiOperation({ summary: 'Create a new dish' })
  @ApiCreatedResponse({ description: 'The dish has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  @Auth([RoleType.OPERATOR, RoleType.PARTNER])
  async createDish(@Body() createDishDto: CreateDishDto) {
    return this.dishesService.createDish(createDishDto);
  }

  @Get('dishes/:id')
  @ApiOperation({ summary: 'Get a dish by ID' })
  @ApiParam({ name: 'id', description: 'ID of the dish' })
  @ApiWrapperResponse({ description: 'The dish', type: DishDto })
  @ApiNotFoundResponse({ description: 'Dish not found.' })
  @Auth([RoleType.OPERATOR, RoleType.PARTNER])
  async findDishById(@Param('id') id: string) {
    const { dish } = await this.dishesService.findDishById(id);
    return dish;
  }

  @Put('dishes/:id')
  @ApiOperation({ summary: 'Update a dish by ID' })
  @ApiParam({ name: 'id', description: 'ID of the dish' })
  @ApiWrapperResponse({
    description: 'The dish has been successfully updated.',
    type: UpdateDishResponseDto,
  })
  @Auth([RoleType.OPERATOR, RoleType.PARTNER])
  async updateDish(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return await this.dishesService.updateDish(id, updateDishDto);
  }

  @Delete('dishes/:id')
  @ApiOperation({ summary: 'Delete a dish by ID' })
  @ApiParam({ name: 'id', description: 'ID of the dish' })
  @ApiWrapperResponse({
    description: 'The dish has been successfully deleted.',
    type: DeleteDishResponseDto,
  })
  @Auth([RoleType.OPERATOR, RoleType.PARTNER])
  async deleteDish(@Param('id') id: string) {
    return this.dishesService.deleteDish(id);
  }

  @Get('dishes')
  @ApiOperation({ summary: 'Get list dishes' })
  @ApiPageWrapperResponse({ description: 'List of dishes', type: FindDishesResponseDto })
  @Auth([RoleType.OPERATOR, RoleType.PARTNER])
  async findAllDishes(@Query() query: FindDishesQueryDto) {
    const { dishes, totalCount } = await this.dishesService.findDishesWithPagination(query);
    const { page, pageSize } = query;

    if (isEmpty(dishes)) {
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

    return new PageDto(dishes, pageMeta);
  }

  @Get('occasion-events')
  @ApiOperation({ summary: 'Retrieve all occasion events' })
  @ApiWrapperResponse({
    description: 'Retrieve all occasion events',
    type: [FilterOptionDto],
  })
  async findOccasionEvents() {
    const result = await this.menusService.findOccasionEvents();
    return result;
  }

  @Get('cuisine-types')
  @ApiOperation({ summary: 'Retrieve all cuisine types' })
  @ApiWrapperResponse({
    description: 'Retrieve all cuisine types',
    type: [FilterOptionDto],
  })
  async findCuisineTypes() {
    const result = await this.menusService.findCuisineTypes();
    return result;
  }

  @Get('special-dietaries')
  @ApiOperation({ summary: 'Retrieve all special dietaries' })
  @ApiWrapperResponse({
    description: 'Retrieve all special dietaries',
    type: [FilterOptionDto],
  })
  async findSpecialDietaries() {
    const result = await this.menusService.findSpecialDietaries();
    return result;
  }
}
