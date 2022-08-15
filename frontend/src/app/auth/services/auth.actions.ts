import { createAction, props } from '@ngrx/store';
import { User } from 'firebase/auth';

export const signIn = createAction('SignIn', props<User>());
export const signOut = createAction('SignOut');
