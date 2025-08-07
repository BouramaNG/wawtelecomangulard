import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTemplateCreateComponent } from './admin-template-create.component';

describe('AdminTemplateCreateComponent', () => {
  let component: AdminTemplateCreateComponent;
  let fixture: ComponentFixture<AdminTemplateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTemplateCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminTemplateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
