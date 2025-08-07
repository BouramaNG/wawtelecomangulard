import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LangageService {
  public langs = ['fr', 'en', 'ar'];

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
    const browserLang = localStorage.getItem('preferredLanguage') || 'fr';
    this.translate.use(browserLang);
  }

  setLanguage(lang: string) {
    localStorage.setItem('preferredLanguage', lang);
    this.translate.use(lang);
  }

  getCurrentLang(): string {
    return this.translate.currentLang;
  }
}