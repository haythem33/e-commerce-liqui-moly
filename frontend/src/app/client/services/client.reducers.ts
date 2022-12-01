import { createReducer, on } from '@ngrx/store';
import { cars_category } from 'src/app/models/cars-category.model';
import { car_parts } from 'src/app/models/cars-parts.model';
import { cars } from 'src/app/models/cars.model';
import { queryProductBy, removeQuery } from './client.actions';

export interface client_State {
  query_type: 'CARS' | 'CATEGORY' | 'CAR_PARTS' | null;
  value: cars | car_parts | cars_category | null;
}
export const initialState: client_State = {
  query_type: null,
  value: null,
};
export const ClientReducers = createReducer(
  initialState,
  on(queryProductBy, (state, query) => ({
    query_type: query.query_type,
    value: query.value,
  })),
  on(removeQuery, (state) => ({ query_type: null, value: null }))
);
