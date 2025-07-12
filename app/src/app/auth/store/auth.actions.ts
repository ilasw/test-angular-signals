import { createAction, props } from '@ngrx/store';
import { User } from '@/shared/models/user.model';

// Login actions
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout action
export const logout = createAction('[Auth] Logout');

// Load user from storage (on app initialization)
export const loadUser = createAction('[Auth] Load User');
export const loadUserSuccess = createAction(
  '[Auth] Load User Success',
  props<{ user: User; token: string }>()
);
export const loadUserFailure = createAction('[Auth] Load User Failure');
