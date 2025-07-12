import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Logout
  on(AuthActions.logout, () => initialAuthState),

  // Load User
  on(AuthActions.loadUser, (state) => ({
    ...state,
    isLoading: true
  })),

  on(AuthActions.loadUserSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    isLoading: false
  })),

  on(AuthActions.loadUserFailure, () => initialAuthState)
);
