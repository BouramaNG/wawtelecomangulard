import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';


class TranslateLoaderMock implements TranslateLoader { 
  getTranslation(lang: string) {
    return of({});
  }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'wawTelecom' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('wawTelecom');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, wawTelecom');
  });
});
