import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule  } from '@angular/router';
import { LanguageSelectorComponent } from "../../language-selector/language-selector.component";
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';
import { EncryptionService } from '../../services/encryption.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule,
    RouterModule,
    TranslateModule,
    LanguageSelectorComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isDropdownOpen: boolean = false;
  activeDropdown: string | null = null;

  token: any;
  deconnexion() {
    this.loginService.logout().subscribe(
      (response: any) => {
        console.log(response);
        this.showMessage('success','Felicitation',`${response.message}`)
        localStorage.removeItem('token');
        this.router.navigate(['/'])
      },
      (error) => {
        console.error('Erreur lors de la déconnexion :', error);
         if (error.status === 401) {
          this.showMessage('error', 'Erreur serveur', 'Votre token a expiré, veuillez allez à la page de connexion.');
          localStorage.removeItem('token')
          this.router.navigate(['/login'])
        } else {
          this.showMessage('error', 'Erreur', 'Une erreur inattendue est survenue.');
        }
      }
    );
  }
  currentLang: string;
  loggedIn: any;
  loggedOut: any;

  constructor(private translate: TranslateService, private router: Router, private loginService :LoginService,private encryptionService: EncryptionService) {
    this.currentLang = this.translate.currentLang;
    
    // S'abonner aux changements de langue
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
    
  }

  ngOnInit(): void {
    const tokenChiffre = localStorage.getItem('token');
if (tokenChiffre) {
  this.token = this.encryptionService.decryptData(tokenChiffre);
  // console.log('Token déchiffré:', this.token);
}

// ✅ Vérification du token après le déchiffrement
if (this.token && this.token !== 'null' && this.token !== 'undefined' && this.token.trim() !== '') {
  // console.log("Token trouvé :", this.token);
  this.loggedIn = true;
  this.loggedOut = false;
} else {
  // console.log("Aucun token trouvé");
  this.loggedIn = false;
  this.loggedOut = true;
}
  }
 
  isMenuOpen = false;
  isScrolled = false;

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // isServicesActive(): boolean {
  //   const currentUrl = this.router.url;
  //   return ['/connectivite', '/cloud', '/service'].some(path => 
  //     currentUrl.startsWith(path)
  //   );
  // }
    showMessage(icon:any, titre:any, texte:any){
      Swal.fire({
        icon: icon,
        title: titre,
        text: texte,
        confirmButtonColor: "#ffdd33",
      })
    }
}
