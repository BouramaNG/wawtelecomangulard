import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigComponent } from "../../partials/navig/navig.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, NavigComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
