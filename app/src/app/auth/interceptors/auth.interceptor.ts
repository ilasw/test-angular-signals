import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { selectToken } from '../store/auth.selectors';
import { first, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('AuthInterceptor');
    return this.store.select(selectToken).pipe(
      first(),
      switchMap(token => {
        if (token) {
          console.log('using token:', token);
          const authReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(authReq);
        }
        return next.handle(request);
      })
    );
  }
}
