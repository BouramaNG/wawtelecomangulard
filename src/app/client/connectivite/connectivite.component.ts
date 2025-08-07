import { Component } from '@angular/core';
import { HeaderComponent } from "../../partials/header/header.component";
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-connectivite',
  standalone: true,
  imports: [HeaderComponent, RouterLink, TranslateModule],
  templateUrl: './connectivite.component.html',
  styleUrl: './connectivite.component.css'
})
export class ConnectiviteComponent {

}
