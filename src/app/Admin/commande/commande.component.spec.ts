import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeComponent } from './commande.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CommandeComponent', () => {
  let component: CommandeComponent;
  let fixture: ComponentFixture<CommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeComponent,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
