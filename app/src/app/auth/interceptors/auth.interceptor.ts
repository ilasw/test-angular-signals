import {inject, Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '@/store';
import {selectToken} from '../store/auth.selectors';
import {catchError, first, switchMap} from 'rxjs/operators';
import {AuthService} from "@/auth/services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authService = inject(AuthService);
  private store = inject(Store<AppState>);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.store.select(selectToken).pipe(
      first(),
      switchMap(token => {
        if (token) {
          const authReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(authReq);
        }
        return next.handle(request);
      }),
      catchError(
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout();
          }
          throw error;
        }
      )
    );
  }
}
