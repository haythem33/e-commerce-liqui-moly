import { createReducer, on } from '@ngrx/store';
import { car_parts } from 'src/app/models/cars-parts.model';
import {
  addProductQuantity,
  addProductToCart,
  loadUserCart,
  removeProductFromCart,
  removeProductQuantity,
} from './cart.actions';

export interface cart_State {
  cart: Array<{ car_part: car_parts; quantity: number }>;
}
export const initialState: cart_State = {
  cart: [],
};
export const CartReducers = createReducer(
  initialState,
  on(loadUserCart, (state, obj) => ({ cart: obj.allCart })),
  on(addProductToCart, (state, product) => ({
    cart: [...state.cart, product],
  })),
  on(removeProductFromCart, (state, { _id }) => ({
    cart: state.cart.filter((part) => part.car_part._id !== _id),
  })),
  on(addProductQuantity, (state, { _id }) => ({
    cart: state.cart.map((product) =>
      product.car_part._id === _id
        ? { ...product, quantity: product.quantity + 1 }
        : product
    ),
  })),
  on(removeProductQuantity, (state, { _id }) => ({
    cart: state.cart.map((product) =>
      product.car_part._id === _id
        ? { ...product, quantity: product.quantity - 1 }
        : product
    ),
  }))
);
