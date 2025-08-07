import { Component } from '@angular/core';
import { HeaderComponent } from "../../partials/header/header.component";
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-peer',
  standalone: true,
  imports: [HeaderComponent, TranslateModule, RouterLink],
  templateUrl: './peer.component.html',
  styleUrl: './peer.component.css'
})
export class PeerComponent {

}
