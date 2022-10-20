import { createAction, props } from '@ngrx/store';
import { cars } from 'src/app/models/cars.model';

export const queryProductByCar = createAction(
  'searchProductByCar',
  props<cars>()
);
export const removeQuery = createAction('removeQuery');
