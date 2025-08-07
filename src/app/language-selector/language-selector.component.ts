import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LangageService } from '../services/langage.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="lang-selector">
      <select (change)="switchLang($event)" [value]="currentLang">
        <option value="fr">Français</option>
        <option value="en">English</option>
        <option value="ar">العربية</option>
         <option value="es">Español</option> <!-- Ajout de l'espagnol -->
           <option value="wo">Wolof</option> <!-- ✅ Ajout du wolof -->
      </select>
    </div>
  `,
  styles: [`
    .lang-selector {
      margin: 10px;
    }
    select {
      padding: 5px;
      border-radius: 4px;
    }
  `]
})
export class LanguageSelectorComponent {
  currentLang: string;

  constructor(private langageService: LangageService) {
    this.currentLang = this.langageService.getCurrentLang();
  }

  switchLang(event: any) {
    this.langageService.setLanguage(event.target.value);
  }
}