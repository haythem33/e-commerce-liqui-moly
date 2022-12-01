import { createAction, props } from '@ngrx/store';
import { cars_category } from 'src/app/models/cars-category.model';
import { car_parts } from 'src/app/models/cars-parts.model';
import { cars } from 'src/app/models/cars.model';

export const queryProductBy = createAction(
  'searchProductBy',
  props<{
    query_type: 'CARS' | 'CATEGORY' | 'CAR_PARTS';
    value: cars | car_parts | cars_category;
  }>()
);
export const removeQuery = createAction('removeQuery');
