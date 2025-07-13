import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {HeaderComponent} from "@/dashboard/components/header/header.component";
import {DashboardService} from "@/dashboard/services/dashboard.service";
import {AsyncPipe} from "@angular/common";
import {Button} from "primeng/button";
import {UserEditModalComponent} from "@/dashboard/components/user-edit-modal/user-edit-modal.component";
import {AuthService} from "@/auth/services/auth.service";
import {map} from "rxjs/operators";
import {User, UserRole} from "@/shared/models/user.model";
import {BehaviorSubject} from "rxjs";
import {DataView} from "primeng/dataview";
import {Tooltip} from "primeng/tooltip";

@Component({
  selector: 'app-dashboard-page',
  imports: [
    HeaderComponent,
    AsyncPipe,
    Button,
    UserEditModalComponent,
    DataView,
    Tooltip
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {

  protected readonly UserRole = UserRole;

  authService = inject(AuthService);
  dashboardService = inject(DashboardService);
  userId$ = this.authService.getUser().pipe(
    map(user => user?.id)
  );
  canUserEdit$ = this.dashboardService.canUserEdit$;

  userRequestRef = this.dashboardService.getAllUsersRef();

  currentEditingUser$ = new BehaviorSubject<User | null>(null);
}
