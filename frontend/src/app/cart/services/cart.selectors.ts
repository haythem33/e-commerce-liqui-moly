import { createFeatureSelector, createSelector } from '@ngrx/store';
import { cart_State } from './cart.reducers';

export const getCart = createFeatureSelector<cart_State>('cartFeature');

export const getCartSelector = createSelector(
  getCart,
  (state: cart_State) => state.cart
);
