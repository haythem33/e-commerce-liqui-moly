import { createReducer, on } from '@ngrx/store';
import { User } from 'firebase/auth';
import { signIn, signOut } from './auth.actions';

export interface auth_State {
  user: User | null;
}
export const initialState: auth_State = {
  user: null,
};

export const Authreducers = createReducer(
  initialState,
  on(signIn, (state, user) => ({ user: user })),
  on(signOut, (state) => ({ user: null }))
);
