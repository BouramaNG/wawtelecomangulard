import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiebarComponent } from './siebar.component';

describe('SiebarComponent', () => {
  let component: SiebarComponent;
  let fixture: ComponentFixture<SiebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
