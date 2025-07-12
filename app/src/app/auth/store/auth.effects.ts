import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as AuthActions from './auth.actions';
import {User} from "../../shared/models/user.model";

interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.http.post<LoginResponse>('http://localhost:3030/auth/login', { email, password }).pipe(
          map((response) => {
            // Store token in localStorage for persistence
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));

            return AuthActions.loginSuccess({
              user: response.user,
              token: response.access_token
            });
          }),
          catchError((error) => {
            console.error('Login error:', error);
            return of(AuthActions.loginFailure({
              error: error.error?.message || 'Login failed. Please check your credentials.'
            }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => console.log('login success')),
        tap(() => {
          // Navigate to dashboard or home page after successful login
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUser),
      switchMap(() => {
        const token = localStorage.getItem('access_token');
        const userJson = localStorage.getItem('user');

        if (token && userJson) {
          try {
            const user = JSON.parse(userJson);
            return of(AuthActions.loadUserSuccess({ user, token }));
          } catch (error) {
            return of(AuthActions.loadUserFailure());
          }
        } else {
          return of(AuthActions.loadUserFailure());
        }
      })
    )
  );
}
