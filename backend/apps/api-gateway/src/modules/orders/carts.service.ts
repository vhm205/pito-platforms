import { ORDER_SERVICE, ORDERS_SERVICE_NAME, OrdersServiceClient } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

import { AddItemToCartRequestDto } from './dto/add-item-to-cart.dto';
import { UpdateCartItemRequestDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartsService {
  private orderServiceClient: OrdersServiceClient;

  constructor(@Inject(ORDER_SERVICE) private readonly orderClient: ClientGrpc) {
    this.orderServiceClient = this.orderClient.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);
  }

  addItemToCart(payload: AddItemToCartRequestDto, userId: string) {
    const source$ = this.orderServiceClient
      .addItemToCart({ ...payload, userId })
      .pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  updateItemInCart(payload: UpdateCartItemRequestDto, userId: string) {
    const source$ = this.orderServiceClient
      .updateItemInCart({ ...payload, userId })
      .pipe(timeout(3000));
    return firstValueFrom(source$);
  }

  getCarts(userId: string, storeId?: string) {
    const source$ = this.orderServiceClient.getCarts({ userId, storeId }).pipe(timeout(2000));
    return firstValueFrom(source$);
  }
}
