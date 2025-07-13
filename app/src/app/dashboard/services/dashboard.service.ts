import {inject, Injectable} from '@angular/core';
import {HttpClient, httpResource} from "@angular/common/http";
import {apiUrl} from "@/shared/constants";
import {User, UserRole} from "@/shared/models/user.model";
import {AuthService} from "@/auth/services/auth.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  authService = inject(AuthService);

  user$ = this.authService.getUser();
  canUserEdit$ = this.user$.pipe(
    map(user => user?.role === UserRole.Admin)
  );

  getAllUsersRef() {
    return httpResource<Array<User>>(() => `${apiUrl}/users`);
  }

  updateUserRole(userId: string, role: UserRole) {
    return this.http.put<User>(`${apiUrl}/users/role/${userId}`, {role});
  }
}
