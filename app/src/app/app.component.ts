import {Component, inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpClient]
})
export class AppComponent {
  title = 'app';
  http = inject(HttpClient);

  request = httpResource(() => 'http://localhost:3030');

  public resource$ = this.http.get('http://localhost:3030')
    .pipe(tap(
      console.log
    ));
}
