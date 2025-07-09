import {Component, inject, ResourceStatus} from '@angular/core';
import {HttpClient, httpResource} from "@angular/common/http";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpClient],
  standalone: false,
})
export class AppComponent {
  title = 'app';
  http = inject(HttpClient);

  // request = httpResource<{ message: string }>(() => 'http://localhost:3030');
}
