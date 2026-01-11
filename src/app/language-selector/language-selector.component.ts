import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LangageService } from '../services/langage.service';

interface Language {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="lang-selector-modern">
      <div class="lang-selector-wrapper" (click)="toggleDropdown()" [class.open]="isOpen">
        <svg class="lang-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span class="lang-selected">
          <span class="lang-flag">{{ getCurrentLanguage()?.flag }}</span>
          <span class="lang-name">{{ getCurrentLanguage()?.name }}</span>
        </span>
        <svg class="lang-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      <div class="lang-dropdown" *ngIf="isOpen">
        <div 
          *ngFor="let lang of languages" 
          class="lang-option"
          [class.active]="lang.code === currentLang"
          (click)="selectLanguage(lang.code)">
          <span class="lang-option-flag">{{ lang.flag }}</span>
          <span class="lang-option-name">{{ lang.name }}</span>
          <svg *ngIf="lang.code === currentLang" class="lang-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lang-selector-modern {
      position: relative;
      display: flex;
      align-items: center;
      z-index: 1001;
    }

    .lang-selector-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: rgba(51, 51, 51, 0.08);
      border: 2px solid rgba(51, 51, 51, 0.15);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 160px;
      user-select: none;
    }

    .lang-selector-wrapper:hover {
      background: rgba(51, 51, 51, 0.12);
      border-color: rgba(51, 51, 51, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .lang-selector-wrapper.open {
      background: rgba(51, 51, 51, 0.15);
      border-color: #333;
      box-shadow: 0 0 0 3px rgba(51, 51, 51, 0.1);
    }

    .lang-icon {
      color: #333;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }

    .lang-selector-wrapper:hover .lang-icon {
      transform: rotate(15deg) scale(1.1);
    }

    .lang-selected {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }

    .lang-flag {
      font-size: 18px;
      line-height: 1;
    }

    .lang-name {
      color: #333;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .lang-arrow {
      color: #333;
      flex-shrink: 0;
      transition: transform 0.3s ease;
      pointer-events: none;
    }

    .lang-selector-wrapper:hover .lang-arrow,
    .lang-selector-wrapper.open .lang-arrow {
      transform: translateY(2px) rotate(180deg);
    }

    .lang-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: #ffffff;
      border: 2px solid rgba(51, 51, 51, 0.15);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1002;
      min-width: 160px;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .lang-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid rgba(51, 51, 51, 0.05);
    }

    .lang-option:last-child {
      border-bottom: none;
    }

    .lang-option:hover {
      background: rgba(255, 221, 51, 0.15);
    }

    .lang-option.active {
      background: rgba(255, 221, 51, 0.25);
      font-weight: 700;
    }

    .lang-option-flag {
      font-size: 20px;
      line-height: 1;
      flex-shrink: 0;
    }

    .lang-option-name {
      flex: 1;
      color: #333;
      font-size: 15px;
      font-weight: 600;
      white-space: nowrap;
    }

    .lang-check {
      color: #333;
      flex-shrink: 0;
      opacity: 0.8;
    }

    /* Mobile styles */
    @media (max-width: 991px) {
      .lang-selector-wrapper {
        min-width: 140px;
        padding: 8px 12px;
        gap: 8px;
      }

      .lang-icon {
        width: 18px;
        height: 18px;
      }

      .lang-flag {
        font-size: 16px;
      }

      .lang-name {
        font-size: 13px;
      }

      .lang-arrow {
        width: 14px;
        height: 14px;
      }

      .lang-dropdown {
        min-width: 140px;
      }

      .lang-option {
        padding: 10px 14px;
        gap: 10px;
      }

      .lang-option-flag {
        font-size: 18px;
      }

      .lang-option-name {
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      .lang-selector-wrapper {
        min-width: 120px;
        padding: 6px 10px;
      }

      .lang-name {
        font-size: 12px;
      }

      .lang-dropdown {
        min-width: 120px;
      }
    }
  `]
})
export class LanguageSelectorComponent {
  isOpen = false;
  currentLang: string;

  languages: Language[] = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'wo', name: 'Wolof', flag: '🇸🇳' }
  ];

  constructor(private langageService: LangageService) {
    this.currentLang = this.langageService.getCurrentLang();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectLanguage(code: string) {
    this.currentLang = code;
    this.langageService.setLanguage(code);
    this.isOpen = false;
  }

  getCurrentLanguage(): Language | undefined {
    return this.languages.find(lang => lang.code === this.currentLang);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.lang-selector-modern')) {
      this.isOpen = false;
    }
  }
}
