import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EncryptionService } from '../../services/encryption.service';
import { LanguageSelectorComponent } from "../../language-selector/language-selector.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navig',
  standalone: true,
  imports: [RouterLink, CommonModule, LanguageSelectorComponent, TranslateModule],
  templateUrl: './navig.component.html',
  styleUrl: './navig.component.css'
})
export class NavigComponent implements OnInit {
  loggedOut: any;
  loggedIn: any;
  token: any;
isAchatActive() {
  const currentUrl = this.route.url;
  return currentUrl.startsWith('/service');
}
isPackActive() {
  const currentUrl = this.route.url;
  return currentUrl.startsWith('/admin/compte');
}
isHisActive() {
  const currentUrl = this.route.url;
  return currentUrl.startsWith('/client/forfait');
}
  constructor(private loginService:LoginService, private route:Router, private encryptionService: EncryptionService){}
  user:any;
  ngOnInit(): void {
    try {
      // userInfo est stocké avec JSON.stringify(userChiffrees) dans login.component.ts
      const userInfoStored = localStorage.getItem('userInfo');
      if (userInfoStored) {
        try {
          // Essayer de parser si c'est une string JSON
          let userInfoEncrypted = userInfoStored;
          try {
            userInfoEncrypted = JSON.parse(userInfoStored);
          } catch (e) {
            // Si ce n'est pas du JSON, utiliser directement
          }
          
          this.user = this.encryptionService.decryptData(userInfoEncrypted);
          console.log('Utilisateur déchiffré:', this.user);
        } catch (e) {
          console.warn('Erreur lors du déchiffrement userInfo:', e);
        }
      }

      const tokenChiffre = localStorage.getItem('token');
      if (tokenChiffre) {
        this.token = this.encryptionService.getDecryptedToken();
        console.log('Token déchiffré:', this.token);
      }
    } catch (e) {
      console.error('Erreur dans ngOnInit navig:', e);
    }

// ✅ Vérification du token après le déchiffrement
if (this.token && this.token !== 'null' && this.token !== 'undefined' && this.token.trim() !== '') {
  console.log("Token trouvé :", this.token);
  this.loggedIn = true;
  this.loggedOut = false;
} else {
  console.log("Aucun token trouvé");
  this.loggedIn = false;
  this.loggedOut = true;
}

  }
  deconnexion() {
    this.loginService.logout().subscribe(
      (response: any) => {
        console.log(response);
        this.showMessage('success','Felicitation',`${response.message}`)
        localStorage.removeItem('token');
        this.route.navigate(['/'])
      },
      (error) => {
        console.error('Erreur lors de la déconnexion :', error);
         if (error.status === 401) {
          this.showMessage('error', 'Erreur serveur', 'Votre token a expiré, veuillez allez à la page de connexion.');
          this.route.navigate(['/login'])
        } else {
          this.showMessage('error', 'Erreur', 'Une erreur inattendue est survenue.');
        }
      }
    );
  }
  isCommandeActive(): boolean {
    const currentUrl = this.route.url;
    return currentUrl.startsWith('/admin/commande');
  }

  isOffreActive(): boolean {
    const currentUrl = this.route.url;
    return currentUrl.startsWith('/admin/offre');
  }

  isDestinationsActive(): boolean {
    const currentUrl = this.route.url;
    return currentUrl.startsWith('/admin/destinations');
  }

  isEsimsActive(): boolean {
    const currentUrl = this.route.url;
    return currentUrl.startsWith('/admin/esims');
  }

  isConsoleConnectActive(): boolean {
    const currentUrl = this.route.url;
    return currentUrl.startsWith('/admin/console-connect');
  }

  isTemplateCreateActive(): boolean {
    const currentUrl = this.route.url;
    return currentUrl.startsWith('/admin/template-create');
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
