import { CUSTOMER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem, Item, ShoppingSession } from 'apps/order-service/src/domain';
import { type FindOptionsWhere, In, Repository } from 'typeorm';

import { ShoppingSessionRepository } from '../../shopping-session.repository';
import { CartItemEntity } from '../entities/cart-item.entity';
import { ItemEntity } from '../entities/item.entity';
import { ShoppingSessionEntity } from '../entities/shopping-session.entity';
import { ItemMapper } from '../mappers/item.mapper';
import { ShoppingSessionMapper, CartItemMapper } from '../mappers/shopping-session.mapper';

@Injectable()
export class ShoppingSessionRelationalRepository implements ShoppingSessionRepository {
  constructor(
    @InjectRepository(ShoppingSessionEntity, CUSTOMER_DB_SOURCE)
    private shoppingSessionRepository: Repository<ShoppingSessionEntity>,
    @InjectRepository(CartItemEntity, CUSTOMER_DB_SOURCE)
    private cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(ItemEntity, CUSTOMER_DB_SOURCE)
    private itemRepository: Repository<ItemEntity>,
  ) {}

  async findOne(
    filter: FindOptionsWhere<Pick<ShoppingSession, 'id' | 'storeId'>>,
  ): Promise<NullableType<ShoppingSession>> {
    const entity = await this.shoppingSessionRepository.findOne({ where: filter });
    return entity ? ShoppingSessionMapper.toDomain(entity) : null;
  }

  async findCartItemsBySessionId(sessionId: string): Promise<CartItem[]> {
    const entities = await this.cartItemRepository.find({
      where: { sessionId },
      relations: ['item'],
    });
    return entities.map(entity => CartItemMapper.toDomain(entity));
  }

  async deleteShoppingSessionById(sessionId: string): Promise<boolean> {
    const results = await Promise.all([
      this.shoppingSessionRepository.delete({ id: sessionId }),
      this.cartItemRepository.delete({ sessionId }),
    ]);
    const isSuccess = results.every(result => (result?.affected || 0) > 0);
    return isSuccess;
  }

  async insertShoppingSession(session: ShoppingSession): Promise<ShoppingSession> {
    const entity = ShoppingSessionMapper.toPersistence(session);
    const newEntity = await this.shoppingSessionRepository.save(entity);
    return ShoppingSessionMapper.toDomain(newEntity);
  }

  async insertCartItem(cartItem: CartItem): Promise<CartItem> {
    const entity = CartItemMapper.toPersistence(cartItem);
    const newEntity = await this.cartItemRepository.save(entity);
    return CartItemMapper.toDomain(newEntity);
  }

  async updateCartItem(cartItem: CartItem): Promise<boolean> {
    const entity = CartItemMapper.toPersistence(cartItem);
    const { id, ...rest } = entity;
    const result = await this.cartItemRepository.update({ id }, rest);
    return !!result.affected;
  }

  async findCartItem(
    filter: FindOptionsWhere<Pick<CartItem, 'id' | 'sessionId' | 'itemId'>>,
  ): Promise<NullableType<CartItem>> {
    const entity = await this.cartItemRepository.findOne({ where: filter });
    return entity ? CartItemMapper.toDomain(entity) : null;
  }

  async findItem(
    filter: FindOptionsWhere<Pick<Item, 'id' | 'storeId'>>,
  ): Promise<NullableType<Item>> {
    const entity = await this.itemRepository.findOne({ where: filter });
    return entity ? ItemMapper.toDomain(entity) : null;
  }

  async getCartSessionsByCustomerId(customerId: string): Promise<ShoppingSession[]> {
    const entities = await this.shoppingSessionRepository.find({ where: { customerId } });
    return entities.map(entity => ShoppingSessionMapper.toDomain(entity));
  }

  async getCartSessionsOfCustomerByStore(
    customerId: string,
    storeId: string,
  ): Promise<ShoppingSession[]> {
    const entities = await this.shoppingSessionRepository.find({ where: { customerId, storeId } });
    return entities.map(entity => ShoppingSessionMapper.toDomain(entity));
  }

  async getCartItemsBySessionIds(sessionIds: string[]): Promise<CartItem[]> {
    const entities = await this.cartItemRepository.find({
      where: { sessionId: In(sessionIds) },
      relations: ['item'],
    });
    return entities.map(entity => CartItemMapper.toDomain(entity));
  }
}
