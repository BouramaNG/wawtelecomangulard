import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErreurComponent } from './erreur.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ErreurComponent', () => {
  let component: ErreurComponent;
  let fixture: ComponentFixture<ErreurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErreurComponent,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
