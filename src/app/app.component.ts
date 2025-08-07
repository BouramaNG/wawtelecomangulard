import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
     
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'wawTelecom';
  constructor(private translate: TranslateService) {
    // Pour le support RTL
    this.translate.onLangChange.subscribe(event => {
      document.dir = event.lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = event.lang;
    });
  }
}
