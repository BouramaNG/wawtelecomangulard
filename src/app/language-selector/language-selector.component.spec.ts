import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSelectorComponent } from './language-selector.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';


class TranslateLoaderMock implements TranslateLoader { 
  getTranslation(lang: string) {
    return of({});
  }
}
describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelectorComponent,
        TranslateModule.forRoot({
                  loader: {
                    provide: TranslateLoader,
                    useClass: TranslateLoaderMock,
                  },
                }),
                HttpClientTestingModule
      ],
      
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
