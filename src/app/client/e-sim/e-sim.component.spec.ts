import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ESimComponent } from './e-sim.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ESimComponent', () => {
  let component: ESimComponent;
  let fixture: ComponentFixture<ESimComponent>;

  beforeEach(async () => {
    const activatedRouteMock = { 
      queryParams: of({}), 
    };
    await TestBed.configureTestingModule({
      imports: [ESimComponent,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ESimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
