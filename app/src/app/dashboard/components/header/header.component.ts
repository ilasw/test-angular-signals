import {Component, inject} from '@angular/core';
import {Button} from "primeng/button";
import {Tooltip} from "primeng/tooltip";
import {AuthService} from "@/auth/services/auth.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-header',
  imports: [
    Button,
    Tooltip,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  authService = inject(AuthService)

  user$ = this.authService.getUser();

  logout() {
    this.authService.logout();
  }
}
