import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "./auth/pages/login-page/login-page.component";
import {onlyGuestUsersGuard, onlyLoggedUsersGuard} from "./auth/guards/auth.guard";
import {DashboardPageComponent} from "@/dashboard/pages/dashboard-page/dashboard-page.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [onlyGuestUsersGuard]
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [onlyLoggedUsersGuard]
  },
  {
    path: '**',
    redirectTo: '/login',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
