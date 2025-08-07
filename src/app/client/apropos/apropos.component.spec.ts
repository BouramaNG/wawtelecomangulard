import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { AproposComponent } from './apropos.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute } from '@angular/router';

class TranslateLoaderMock implements TranslateLoader { 
  getTranslation(lang: string) {
    return of({});
  }
}

describe('AproposComponent', () => {
  let component: AproposComponent;
  let fixture: ComponentFixture<AproposComponent>;

  beforeEach(async () => {
    const activatedRouteMock = { 
      queryParams: of({}), 
      
    };
    await TestBed.configureTestingModule({
      imports: [AproposComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        HttpClientTestingModule
      ],
      providers: [LoginService,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AproposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
