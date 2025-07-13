import {inject} from "@angular/core";
import {CanActivateFn, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "@/store";
import {selectIsAuthenticated, selectUser} from "@/auth/store/auth.selectors";
import {take} from "rxjs";
import {map} from "rxjs/operators";
import {UserRole} from "@/shared/models/user.model";

export const onlyLoggedUsersGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => isAuthenticated || router.createUrlTree(['/login'])),
  );
}

export const onlyGuestUsersGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => !isAuthenticated || router.createUrlTree(['/dashboard'])),
  );
}

export const generateUserGuardByRole = (role: UserRole): CanActivateFn => {
  const store = inject(Store<AppState>);
  return () => store.select(selectUser).pipe(
    take(1),
    map(user => !!user && user.role === role),
  );
}
