import { RoleType } from '@gateway/constants';
import { Auth, AuthUser } from '@gateway/decorators';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

import { AuthenticatedUser } from '../auth/auth-user.interface';

import { CartsService } from './carts.service';
import { AddItemToCartRequestDto } from './dto/add-item-to-cart.dto';
import { GetCartsRequestDto } from './dto/get-carts.dto';
import { UpdateCartItemRequestDto } from './dto/update-cart-item.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly service: CartsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.CUSTOMER])
  addItemToCart(@Body() body: AddItemToCartRequestDto, @AuthUser() user: AuthenticatedUser) {
    return this.service.addItemToCart(body, user.id);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.CUSTOMER])
  updateItemInCart(@Body() body: UpdateCartItemRequestDto, @AuthUser() user: AuthenticatedUser) {
    return this.service.updateItemInCart(body, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get carts' })
  @ApiQuery({ name: 'storeId', required: false, type: String })
  @Auth([RoleType.CUSTOMER])
  async getCarts(@Query() query: GetCartsRequestDto, @AuthUser() user: AuthenticatedUser) {
    return this.service.getCarts(user.id, query.storeId);
  }
}
