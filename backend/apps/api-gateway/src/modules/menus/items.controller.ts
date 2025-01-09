import { ItemStatus } from '@app/common/enums/item';
import { RoleType } from '@gateway/constants';
import { Auth } from '@gateway/decorators';
import { ApiWrapperResponse } from '@gateway/decorators/api-wrapper-response.decorator';
import { PartnerItemDto } from '@gateway/modules/menus/dtos/insert-menu-item.dto';
import { isValidUUID } from '@gateway/utils/common';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import {
  CreateCateringPackageOptionDto,
  UpdateCateringPackageOptionDto,
} from './dtos/mutation-catering-package-option.dto';
import {
  CreateCateringPackageDto,
  UpdateCateringPackageDto,
} from './dtos/mutation-catering-package.dto';
import { ItemsService } from './items.service';
import { MenusService } from './menus.service';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly menusService: MenusService,
    private readonly itemsService: ItemsService,
  ) {}

  @Post('catering-packages')
  @ApiOperation({ summary: 'Create a new catering package' })
  @ApiBody({ type: CreateCateringPackageDto })
  @Auth([RoleType.OPERATOR])
  async createCateringPackage(@Body() body: CreateCateringPackageDto) {
    return this.itemsService.createCateringPackage(body);
  }

  @Put('catering-packages/:id')
  @ApiOperation({ summary: 'Update an existing catering package' })
  @ApiParam({ name: 'id', description: 'ID of the catering package', type: 'integer' })
  @ApiBody({ type: UpdateCateringPackageDto })
  @Auth([RoleType.OPERATOR])
  async updateCateringPackage(@Param('id') id: number, @Body() body: UpdateCateringPackageDto) {
    return this.itemsService.updateCateringPackage({
      id,
      ...body,
    });
  }

  @Delete('catering-packages/:id')
  @ApiOperation({ summary: 'Delete a catering package by ID' })
  @ApiParam({ name: 'id', description: 'ID of the catering package', type: 'integer' })
  @Auth([RoleType.OPERATOR])
  async deleteCateringPackage(@Param('id') id: number) {
    return this.itemsService.deleteCateringPackage(id);
  }

  @Post('catering-packages/options')
  @ApiOperation({ summary: 'Create a new catering package option' })
  @ApiBody({ type: CreateCateringPackageOptionDto })
  @Auth([RoleType.OPERATOR])
  async createCateringPackageOption(@Body() body: CreateCateringPackageOptionDto) {
    return this.itemsService.createCateringPackageOption(body);
  }

  @Put('catering-packages/options/:id')
  @ApiOperation({ summary: 'Update an existing catering package option' })
  @ApiParam({ name: 'id', description: 'ID of the catering package option', type: 'integer' })
  @ApiBody({ type: UpdateCateringPackageOptionDto })
  @Auth([RoleType.OPERATOR])
  async updateCateringPackageOption(
    @Param('id') id: number,
    @Body() body: UpdateCateringPackageOptionDto,
  ) {
    return this.itemsService.updateCateringPackageOption({
      id,
      ...body,
    });
  }

  @Delete('catering-packages/options/:id')
  @ApiOperation({ summary: 'Delete a catering package option by ID' })
  @ApiParam({ name: 'id', description: 'ID of the catering package option', type: 'integer' })
  @Auth([RoleType.OPERATOR])
  async deleteCateringPackageOption(@Param('id') id: number) {
    return this.itemsService.deleteCateringPackageOption(id);
  }

  @Get(':identifier')
  @ApiWrapperResponse({ type: PartnerItemDto })
  async getItemDetail(@Param('identifier') identifier: string) {
    const filters = {
      status: ItemStatus.ACTIVE,
      ...(isValidUUID(identifier) ? { id: identifier } : { slug: identifier }),
    };

    const item = await this.menusService.findItem(filters);
    const transformedItem = plainToInstance(PartnerItemDto, item, {
      excludeExtraneousValues: true,
    });

    return transformedItem;
  }
}
