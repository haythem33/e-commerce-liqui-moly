import { createFeatureSelector, createSelector } from '@ngrx/store';
import { client_State } from './client.reducers';

export const getQuery = createFeatureSelector<client_State>('clientFeature');

export const querySelector = createSelector(
  getQuery,
  (state: client_State) => state.query
);
