import { Component } from '@angular/core';
import {HeaderComponent} from "@/dashboard/components/header/header.component";

@Component({
  selector: 'app-dashboard-page',
  imports: [
    HeaderComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {

}
