import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { EncryptionService } from '../../services/encryption.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(private loginService:LoginService, private route:Router, private encryptionService: EncryptionService){}
  email: any;
  password: any;
  ngOnInit(): void {
   
  }
  connexion() {
    const credentials = {
      email: this.email,
      password: this.password,
    };
  
    this.loginService.login(credentials).subscribe(
      (response: any) => {
        console.log(response);
  
        if (response && response.token) {
          
  
          const tokenChiffrees = this.encryptionService.encryptData(response.token);
          const userChiffrees = this.encryptionService.encryptData(response.user);
          localStorage.setItem("token", tokenChiffrees);
          localStorage.setItem("userInfo", JSON.stringify(userChiffrees));
  
          this.showMessage("success", "Bienvenue", `${response.user.name}`);
  
          // Rediriger en fonction du rôle
          const roleId = response.user.role_id;
          if (roleId === 2) {
            this.route.navigate(["/client/forfait"]);
          } else if (roleId === 1) {
            this.route.navigate(["/admin/offre"]);
          }
        } else if (response.status === 401) {
          // Mauvais identifiants
          this.showMessage('error', 'Attention', 'Vérifiez vos identifiants');
        } else {
          // Autres erreurs possibles
          this.showMessage('error', 'Erreur', 'Une erreur est survenue. Veuillez réessayer.');
        }
      },
      (error: any) => {
        // Gestion des erreurs réseau/serveur
        console.error("Erreur de connexion : ", error);
        if (error.status === 401) {
          this.showMessage('error', 'Accès refusé', 'Identifiants incorrects.');
        } else if (error.status === 500) {
          this.showMessage('error', 'Erreur serveur', 'Veuillez réessayer plus tard.');
        } else if (error.status === 422) {
          const validationErrors = error.error.errors;
          let errorMessage = "Erreur de validation :\n";
          for (const [field, messages] of Object.entries(validationErrors)) {
            errorMessage += `${field}: ${(messages as string[]).join(', ')}\n`;
          }
          this.showMessage('error', 'Erreur de validation', errorMessage);
        } else {
          this.showMessage('error', 'Erreur', 'Une erreur inattendue est survenue.');
        }
      }
    );
  }
  showMessage(icon:any, titre:any, texte:any){
    Swal.fire({
      icon: icon,
      title: titre,
      text: texte,
      confirmButtonColor: "#ffdd33",
    })
  }

}
