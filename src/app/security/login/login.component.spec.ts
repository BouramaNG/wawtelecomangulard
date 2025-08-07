import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

class TranslateLoaderMock implements TranslateLoader { 
  getTranslation(lang: string) {
    return of({});
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    const activatedRouteMock = { 
      queryParams: of({}), 
      
    };
    await TestBed.configureTestingModule({
      imports: [LoginComponent,
        TranslateModule.forRoot({
                loader: {
                  provide: TranslateLoader,
                  useClass: TranslateLoaderMock,
                },
              }),
        HttpClientTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
