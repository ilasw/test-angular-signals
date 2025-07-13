import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpClient],
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'app';
  http = inject(HttpClient);
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.loadUser();
  }
}
