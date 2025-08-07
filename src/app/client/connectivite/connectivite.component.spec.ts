import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { ConnectiviteComponent } from './connectivite.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class TranslateLoaderMock implements TranslateLoader { // Déclaration ici
  getTranslation(lang: string) {
    return of({});
  }
}

describe('ConnectiviteComponent', () => {
  let component: ConnectiviteComponent;
  let fixture: ComponentFixture<ConnectiviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectiviteComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        HttpClientTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectiviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
