import { Component } from '@angular/core';
import { HeaderComponent } from '../../partials/header/header.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-apropos',
  standalone: true,
  imports: [HeaderComponent, RouterLink, TranslateModule],
  templateUrl: './apropos.component.html',
  styleUrl: './apropos.component.css'
})
export class AproposComponent {

}
