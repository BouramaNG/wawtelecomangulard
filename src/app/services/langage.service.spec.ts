import { TestBed } from '@angular/core/testing';

import { LangageService } from './langage.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

class TranslateLoaderMock implements TranslateLoader {
  getTranslation(lang: string) {
    return of({}); // Ou un objet de traductions si nécessaire
  }
}

describe('LangageService', () => {
  let service: LangageService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }),
    ],});
    service = TestBed.inject(LangageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
