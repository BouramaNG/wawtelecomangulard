import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { EncryptionService } from '../../services/encryption.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  sidebarCollapsed: boolean = false;
  userName: string = '';
  notificationCount: number = 0;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private encryptionService: EncryptionService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.checkNotifications();
  }

  loadUserInfo(): void {
    try {
      // Récupérer les infos utilisateur depuis localStorage
      // Note: userInfo est stocké avec JSON.stringify(userChiffrees) dans login.component.ts
      const userInfoStored = localStorage.getItem('userInfo');
      
      if (userInfoStored) {
        try {
          // userInfo est stocké comme: JSON.stringify(encryptData(user))
          // Donc on doit d'abord parser le JSON, puis déchiffrer
          let userInfoEncrypted = userInfoStored;
          
          // Essayer de parser si c'est une string JSON
          try {
            userInfoEncrypted = JSON.parse(userInfoStored);
          } catch (e) {
            // Si ce n'est pas du JSON, utiliser directement
            userInfoEncrypted = userInfoStored;
          }
          
          // Maintenant déchiffrer
          const userInfo = this.encryptionService.decryptData(userInfoEncrypted);
          
          // decryptData retourne déjà un objet JSON parsé (car encryptData fait JSON.stringify)
          const user = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
          
          this.userName = user?.name || user?.email?.split('@')[0] || 'Admin';
        } catch (e) {
          console.warn('Erreur lors du chargement des infos utilisateur:', e);
          this.userName = 'Admin';
        }
      } else {
        this.userName = 'Admin';
      }
    } catch (e) {
      console.warn('Erreur lors du chargement des infos utilisateur:', e);
      this.userName = 'Admin';
    }
  }

  checkNotifications(): void {
    // TODO: Implémenter la récupération des notifications
    // Pour l'instant, on simule
    this.notificationCount = 0;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    // Sauvegarder la préférence
    localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed));
  }

  logout(): void {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#333',
      cancelButtonColor: '#ffdd33',
      confirmButtonText: 'Oui, me déconnecter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginService.logout().subscribe({
          next: (response: any) => {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            Swal.fire({
              icon: 'success',
              title: 'Déconnecté',
              text: 'Vous avez été déconnecté avec succès',
              confirmButtonColor: '#333'
            });
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Erreur lors de la déconnexion:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }
}
