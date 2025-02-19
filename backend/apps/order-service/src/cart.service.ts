import {
  AddItemToCartRequest,
  GetCartsRequest,
  GetCartsResponse,
  UpdateItemInCartRequest,
} from '@app/common';
import { Injectable } from '@nestjs/common';

import { ShoppingSessionRepository } from './infrastructure/persistence/shopping-session.repository';
import { calculateTotalPrice, getSelectedOptions } from './utils/cart.util';

@Injectable()
export class CartService {
  constructor(private readonly shoppingSessionRepository: ShoppingSessionRepository) {}

  async addItemToCart({
    userId,
    storeId,
    itemId,
    notes,
    quantity,
    optionsChoices,
  }: AddItemToCartRequest) {
    let session = await this.shoppingSessionRepository.findOne({ customerId: userId, storeId });
    if (!session) {
      session = await this.shoppingSessionRepository.insertShoppingSession({
        customerId: userId,
        storeId,
      });
    }

    const item = await this.shoppingSessionRepository.findItem({ id: itemId, storeId });
    if (!item) {
      throw new Error('Item not found');
    }

    const optionsAndChoicesSelected = getSelectedOptions(item, optionsChoices);
    const totalPrice = calculateTotalPrice(item, quantity, optionsAndChoicesSelected);

    // Insert cart item
    await this.shoppingSessionRepository.insertCartItem({
      sessionId: session.id,
      itemId,
      quantity,
      notes,
      totalPrice,
      rawOptionsChoices: optionsChoices.map(option => ({
        option_id: option.optionId,
        choices: option.choices.map(choice => ({
          choice_id: choice.choiceId,
          quantity: choice.quantity,
        })),
      })),
    });

    return {
      success: true,
    };
  }

  async updateItemInCart({
    userId,
    storeId,
    cartItemId,
    itemId,
    quantity,
    optionsChoices,
  }: UpdateItemInCartRequest) {
    const session = await this.shoppingSessionRepository.findOne({ customerId: userId, storeId });
    if (!session) {
      throw new Error('Cart not found');
    }

    const item = await this.shoppingSessionRepository.findItem({ id: itemId, storeId });
    if (!item) {
      throw new Error('Item not found');
    }

    const optionsAndChoicesSelected = getSelectedOptions(item, optionsChoices);
    const totalPrice = calculateTotalPrice(item, quantity, optionsAndChoicesSelected);

    const cartItem = await this.shoppingSessionRepository.findCartItem({ id: cartItemId });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Update cart item
    const newQuantity = cartItem.quantity + quantity;
    const newTotalPrice = cartItem.totalPrice + totalPrice;

    const isSuccess = await this.shoppingSessionRepository.updateCartItem({
      id: cartItem.id,
      quantity: newQuantity,
      totalPrice: newTotalPrice,
    });

    return {
      success: isSuccess,
    };
  }

  async getCarts({ userId, storeId }: GetCartsRequest): Promise<GetCartsResponse> {
    const sessions = await (storeId
      ? this.shoppingSessionRepository.getCartSessionsOfCustomerByStore(userId, storeId)
      : this.shoppingSessionRepository.getCartSessionsByCustomerId(userId));

    if (!sessions || sessions.length === 0) {
      throw new Error('No cart found');
    }

    const sessionIds = sessions.map(session => session.id);
    const cartItems = await this.shoppingSessionRepository.getCartItemsBySessionIds(sessionIds);

    const resultTransformed = sessions.map(session => {
      const cartItemsOfSession = cartItems.filter(cartItem => cartItem.sessionId === session.id);
      return {
        sessionId: session.id,
        carts: cartItemsOfSession.map(cartItem => ({
          id: cartItem.id,
          quantity: cartItem.quantity,
          sessionId: cartItem.sessionId,
          notes: cartItem.notes as string,
          item: {
            id: cartItem.item?.id as string,
            name: cartItem.item?.name as string,
            slug: cartItem.item?.slug as string,
            basePrice: cartItem.item?.basePrice as number,
            images: cartItem.item?.images as string[],
            unitQuantity: cartItem.item?.unitQuantity as number,
            optionsAndChoices: (cartItem.item?.optionsAndChoices ?? []).map(option => ({
              optionId: option.optionId,
              name: option.name,
              choices: option.choices.map(choice => {
                const choiceSelected = cartItem.rawOptionsChoices
                  .find(rawOption => rawOption.option_id === option.optionId)
                  ?.choices.find(rawChoice => rawChoice.choice_id === choice.choiceId);

                return {
                  choiceId: choice.choiceId,
                  name: choice.name,
                  basePrice: choice.basePrice,
                  quantity: choiceSelected?.quantity ?? 0,
                };
              }),
            })),
          },
        })),
      };
    });

    return {
      sessions: resultTransformed,
    };
  }
}
