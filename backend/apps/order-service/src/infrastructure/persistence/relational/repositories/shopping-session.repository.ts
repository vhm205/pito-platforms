import { CUSTOMER_DB_SOURCE } from '@app/common';
import { NullableType } from '@app/common/types/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem, ShoppingSession } from 'apps/order-service/src/domain';
import { type FindOptionsWhere, Repository } from 'typeorm';

import { ShoppingSessionRepository } from '../../shopping-session.repository';
import { CartItemEntity } from '../entities/cart-item.entity';
import { ShoppingSessionEntity } from '../entities/shopping-session.entity';
import { ShoppingSessionMapper, CartItemMapper } from '../mappers/shopping-session.mapper';

@Injectable()
export class ShoppingSessionRelationalRepository implements ShoppingSessionRepository {
  constructor(
    @InjectRepository(ShoppingSessionEntity, CUSTOMER_DB_SOURCE)
    private shoppingSessionRepository: Repository<ShoppingSessionEntity>,
    @InjectRepository(CartItemEntity, CUSTOMER_DB_SOURCE)
    private cartItemRepository: Repository<CartItemEntity>,
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
}
