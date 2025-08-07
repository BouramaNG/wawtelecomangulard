import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudComponent } from './cloud.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CloudComponent', () => {
  let component: CloudComponent;
  let fixture: ComponentFixture<CloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloudComponent,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
