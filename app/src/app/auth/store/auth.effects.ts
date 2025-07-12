import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import * as AuthActions from './auth.actions';
import {User} from "@/shared/models/user.model";

interface LoginResponse {
  access_token: string;
  user: User;
}

export const TOKEN_LOCAL_KEY = 'dashboard:access_token';
export const USER_LOCAL_KEY = 'dashboard:user';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({email, password}) =>
        this.http.post<LoginResponse>('http://localhost:3030/auth/login', {email, password}).pipe(
          map((response) => {
            // Store token in localStorage for persistence
            localStorage.setItem(TOKEN_LOCAL_KEY, response.access_token);
            localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(response.user));

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
        tap(() => this.router.navigate(['/dashboard']))
      ),
    {dispatch: false}
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem(TOKEN_LOCAL_KEY);
          localStorage.removeItem(USER_LOCAL_KEY);
          this.router.navigate(['/login']);
        })
      ),
    {dispatch: false}
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUser),
      switchMap(() => {
        const token = localStorage.getItem(TOKEN_LOCAL_KEY);
        const userJson = localStorage.getItem(USER_LOCAL_KEY);

        const isTokenExpired = (token: string | null): boolean => {
          if (!token) return true;
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000; // Convert to milliseconds
          return Date.now() > expirationTime;
        }

        if (token && userJson && !isTokenExpired(token)) {
          try {
            const user = JSON.parse(userJson);
            return of(AuthActions.loadUserSuccess({user, token}));
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
