import { Component } from '@angular/core';
import { NavigComponent } from '../../../partials/navig/navig.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [NavigComponent, RouterOutlet],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {

}
