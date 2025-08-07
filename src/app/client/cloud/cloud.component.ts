import { Component } from '@angular/core';
import { HeaderComponent } from '../../partials/header/header.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cloud',
  standalone: true,
  imports: [HeaderComponent, RouterLink, TranslateModule],
  templateUrl: './cloud.component.html',
  styleUrl: './cloud.component.css'
})
export class CloudComponent {

}
