import { createReducer, on } from '@ngrx/store';
import { cars_category } from 'src/app/models/cars-category.model';
import { car_parts } from 'src/app/models/cars-parts.model';
import { cars } from 'src/app/models/cars.model';
import { queryProductBy, removeQuery } from './client.actions';

export interface client_State {
  query: cars | car_parts | cars_category | null;
}
export const initialState: client_State = {
  query: null,
};
export const ClientReducers = createReducer(
  initialState,
  on(queryProductBy, (state, query) => ({ query: query })),
  on(removeQuery, (state) => ({ query: null }))
);
