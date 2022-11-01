import { createAction, props } from '@ngrx/store';
import { car_parts } from 'src/app/models/cars-parts.model';

export const loadUserCart = createAction(
  'loadUserCart',
  props<{ allCart: Array<{ car_part: car_parts; quantity: number }> }>()
);
export const addProductToCart = createAction(
  'addProductToCart',
  props<{ car_part: car_parts; quantity: number }>()
);
export const removeProductFromCart = createAction(
  'removeProductFromCart',
  props<{ _id: string }>()
);
