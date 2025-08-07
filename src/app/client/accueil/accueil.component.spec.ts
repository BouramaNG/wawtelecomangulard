import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilComponent } from './accueil.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';


class TranslateLoaderMock implements TranslateLoader { 
  getTranslation(lang: string) {
    return of({});
  }
}
describe('AccueilComponent', () => {
  let component: AccueilComponent;
  let fixture: ComponentFixture<AccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilComponent,
         TranslateModule.forRoot({
                  loader: {
                    provide: TranslateLoader,
                    useClass: TranslateLoaderMock,
                  },
                }),
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
