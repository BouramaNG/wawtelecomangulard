import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { EncryptionService } from '../../services/encryption.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, TranslateModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(private loginService:LoginService, private route:Router, private encryptionService: EncryptionService){}
  email: any;
  password: any;
  showPassword: boolean = false;
  rememberMe: boolean = false;
  isLoading: boolean = false;

  ngOnInit(): void {
    // Vérifier si un email est sauvegardé
    const rememberedEmail = localStorage.getItem("rememberEmail");
    if (rememberedEmail) {
      this.email = rememberedEmail;
      this.rememberMe = true;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  connexion() {
    if (!this.email || !this.password) {
      this.showMessage('error', 'Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }

    this.isLoading = true;
    const credentials = {
      email: this.email,
      password: this.password,
    };
  
    this.loginService.login(credentials).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log(response);
  
        if (response && response.token) {
          console.log('✅ Connexion réussie, données reçues:', response);
          console.log('🔵 [LOGIN] Token brut reçu:', response.token.substring(0, 30) + '...');
          console.log('🔵 [LOGIN] Token longueur:', response.token.length);
          
          // TEMPORAIRE: Stocker le token SANS chiffrement comme waw-admin-dashboard pour tester
          // TODO: Revenir au chiffrement une fois que le problème est résolu
          localStorage.setItem("token", response.token);
          const userChiffrees = this.encryptionService.encryptData(response.user);
          localStorage.setItem("userInfo", JSON.stringify(userChiffrees));
          
          console.log('🔵 [LOGIN] Token stocké directement (non chiffré) pour test');

          // Sauvegarder "remember me" si coché
          if (this.rememberMe) {
            localStorage.setItem("rememberEmail", this.email);
          } else {
            localStorage.removeItem("rememberEmail");
          }

          // Récupérer le nom de l'utilisateur
          const userName = response.user?.name || response.user?.email?.split('@')[0] || 'Utilisateur';
          const roleId = response.user.role_id;
          
          console.log('👤 Nom utilisateur:', userName);
          console.log('🔑 Role ID:', roleId);
          console.log('📢 Appel de showWelcomeMessage...');

          // Afficher le message de bienvenue et rediriger après
          this.showWelcomeMessage(userName, roleId);
        } else if (response.status === 401) {
          // Mauvais identifiants
          this.showMessage('error', 'Attention', 'Vérifiez vos identifiants');
        } else {
          // Autres erreurs possibles
          this.showMessage('error', 'Erreur', 'Une erreur est survenue. Veuillez réessayer.');
        }
      },
      (error: any) => {
        this.isLoading = false;
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

  showWelcomeMessage(userName: string, roleId: number) {
    console.log('🎉 showWelcomeMessage appelé avec:', { userName, roleId });
    console.log('🔍 Swal disponible?', typeof Swal);
    
    // Vérifier que Swal est disponible
    if (!Swal || typeof Swal.fire !== 'function') {
      console.error('❌ SweetAlert2 n\'est pas disponible!');
      alert(`Bienvenue ${userName} ! Connexion réussie.`);
      // Rediriger quand même
      setTimeout(() => {
        if (roleId === 2) {
          this.route.navigate(["/client/forfait"]);
        } else if (roleId === 1) {
          this.route.navigate(["/admin/offre"]);
        }
      }, 1000);
      return;
    }
    
    // Utiliser setTimeout pour s'assurer que le DOM est prêt
    setTimeout(() => {
      try {
        Swal.fire({
          icon: 'success',
          title: `Bienvenue ${userName} ! 👋`,
          html: `
            <div style="text-align: center; padding: 10px 0;">
              <div style="font-size: 50px; margin: 15px 0;">🎉</div>
              <p style="font-size: 18px; color: #2c3e50; margin: 10px 0; font-weight: 600;">
                Nous sommes ravis de vous revoir !
              </p>
              <p style="font-size: 15px; color: #7f8c8d; margin: 10px 0;">
                Vous êtes maintenant connecté à votre compte WAW Telecom.
              </p>
            </div>
          `,
          confirmButtonText: 'Continuer',
          confirmButtonColor: "#ffdd33",
          width: '450px',
          padding: '2rem',
          timer: 3000,
          timerProgressBar: true,
          allowOutsideClick: false,
          showCloseButton: false,
          didOpen: () => {
            console.log('✅ Modal de bienvenue ouvert');
          }
        }).then((result) => {
          console.log('🔄 Modal fermé, redirection...', result);
          // Rediriger après la fermeture du message
          if (roleId === 2) {
            this.route.navigate(["/client/forfait"]);
          } else if (roleId === 1) {
            this.route.navigate(["/admin/offre"]);
          }
        });
      } catch (error) {
        console.error('❌ Erreur lors de l\'affichage du message:', error);
        // Fallback : message simple
        this.showMessage('success', `Bienvenue ${userName} !`, 'Connexion réussie');
        // Rediriger après un délai
        setTimeout(() => {
          if (roleId === 2) {
            this.route.navigate(["/client/forfait"]);
          } else if (roleId === 1) {
            this.route.navigate(["/admin/offre"]);
          }
        }, 2000);
      }
    }, 100); // Petit délai pour s'assurer que tout est prêt
  }

}
