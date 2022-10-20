import { createReducer, on } from '@ngrx/store';
import { cars } from 'src/app/models/cars.model';
import { queryProductByCar, removeQuery } from './client.actions';

export interface client_State {
  queryProductByCar: cars | null;
}
export const initialState: client_State = {
  queryProductByCar: null,
};
export const ClientReducers = createReducer(
  initialState,
  on(queryProductByCar, (state, car) => ({ queryProductByCar: car })),
  on(removeQuery, (state) => ({ queryProductByCar: null }))
);
