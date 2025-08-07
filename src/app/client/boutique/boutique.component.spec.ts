import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueComponent } from './boutique.component';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';


class TranslateLoaderMock implements TranslateLoader { 
  getTranslation(lang: string) {
    return of({});
  }
}
describe('BoutiqueComponent', () => {
  let component: BoutiqueComponent;
  let fixture: ComponentFixture<BoutiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
