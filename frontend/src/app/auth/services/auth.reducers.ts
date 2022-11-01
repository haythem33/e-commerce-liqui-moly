import { createReducer, on } from '@ngrx/store';
import { User } from 'firebase/auth';
import { user_shop } from 'src/app/models/user-shop.model';
import { signIn, signOut } from './auth.actions';

export interface auth_State {
  user: user_shop | null;
}
export const initialState: auth_State = {
  user: null,
};

export const Authreducers = createReducer(
  initialState,
  on(signIn, (state, user) => ({ user: user })),
  on(signOut, (state) => ({ user: null }))
);
