import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Importez HttpClientTestingModule
import { LoginService } from '../../services/login.service'; // Importez votre service
import { HttpClient } from '@angular/common/http'; 


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let loginService: LoginService; // Déclarez une variable pour le service
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule],
      providers: [LoginService],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
