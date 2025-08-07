import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForfaitComponent } from './forfait.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ForfaitComponent', () => {
  let component: ForfaitComponent;
  let fixture: ComponentFixture<ForfaitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForfaitComponent,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForfaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
