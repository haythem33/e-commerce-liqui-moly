import { createFeatureSelector, createSelector } from '@ngrx/store';
import { auth_State } from './auth.reducers';

export const authFeature = createFeatureSelector<auth_State>('authFeature');

export const AuthSelectors = createSelector(
  authFeature,
  (state: auth_State) => state.user
);
