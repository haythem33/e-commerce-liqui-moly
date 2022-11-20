import { createAction, props } from '@ngrx/store';
import { user_shop } from 'src/app/models/user-shop.model';

export const signIn = createAction('SignIn', props<user_shop>());
export const signOut = createAction('SignOut');
