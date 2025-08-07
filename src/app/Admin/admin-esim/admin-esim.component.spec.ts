import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEsimComponent } from './admin-esim.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('AdminEsimComponent', () => {
  let component: AdminEsimComponent;
  let fixture: ComponentFixture<AdminEsimComponent>;

  beforeEach(async () => {
     const activatedRouteMock = { 
          queryParams: of({}), 
          
        };
    await TestBed.configureTestingModule({
      imports: [AdminEsimComponent,
        HttpClientTestingModule,
        ],
         providers: [
                { provide: ActivatedRoute, useValue: activatedRouteMock },
              ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEsimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
