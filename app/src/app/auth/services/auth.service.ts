import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from '@/store';
import * as AuthActions from '../store/auth.actions';
import * as AuthSelectors from '../store/auth.selectors';
import {User} from '@/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private store = inject(Store<AppState>);

  // Dispatch login action
  login({email, password}: Record<'email' | 'password', string>): void {
    this.store.dispatch(AuthActions.login({email, password}));
  }

  // Dispatch logout action
  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  // Load user from localStorage on app initialization
  loadUser(): void {
    this.store.dispatch(AuthActions.loadUser());
  }

  // Selectors as observables
  getUser(): Observable<User | null> {
    return this.store.select(AuthSelectors.selectUser);
  }

  getToken(): Observable<string | null> {
    return this.store.select(AuthSelectors.selectToken);
  }

  isAuthenticated(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectIsAuthenticated);
  }

  isLoading(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectIsLoading);
  }

  getError(): Observable<string | null> {
    return this.store.select(AuthSelectors.selectAuthError);
  }
}
