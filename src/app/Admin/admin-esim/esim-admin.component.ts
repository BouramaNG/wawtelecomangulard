import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { EsimAdminService, Esim, EsimStats } from '../../services/esim-admin.service';

@Component({
  selector: 'app-esim-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './esim-admin.component.html',
  styleUrls: ['./esim-admin.component.css']
})
export class EsimAdminComponent implements OnInit {
  esims: Esim[] = [];
  stats: EsimStats | null = null;
  loading = false;
  error = '';
  searchTerm = '';
  selectedEsim: Esim | null = null;
  showEditModal = false;
  viewMode: 'grid' | 'table' = 'grid'; // Mode d'affichage: grille ou tableau
  itemsPerPage: number = 15; // Par défaut 15 comme le backend
  page: number = 1;
  copySuccess = false;
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  } | null = null;
  searchTimeout: any;

  constructor(private esimService: EsimAdminService) { }

  ngOnInit(): void {
    this.loadEsims();
  }

  loadEsims(page: number = 1): void {
    this.loading = true;
    this.error = '';
    this.page = page;

    const params: any = {
      page: page,
      per_page: this.itemsPerPage
    };

    // Ajouter le terme de recherche si présent
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      params.search = this.searchTerm.trim();
    }

    console.log('🔵 [ESIM-ADMIN] Chargement eSIMs avec params:', params);

    this.esimService.getEsims(params).subscribe({
      next: (response) => {
        console.log('🟢 [ESIM-ADMIN] Réponse reçue:', response);
        this.esims = response.esims || [];
        this.stats = response.stats;
        this.pagination = response.pagination || null;
        this.loading = false;
        
        if (this.pagination) {
          console.log('🟢 [ESIM-ADMIN] Pagination complète:', JSON.stringify(this.pagination, null, 2));
          console.log(`🟢 [ESIM-ADMIN] Page ${this.pagination.current_page} sur ${this.pagination.last_page} (Total: ${this.pagination.total} eSIMs)`);
          console.log(`🟢 [ESIM-ADMIN] Affichage des eSIMs ${this.pagination.from} à ${this.pagination.to}`);
        } else {
          console.warn('🟡 [ESIM-ADMIN] Aucune pagination dans la réponse');
        }
      },
      error: (error) => {
        console.error('🔴 [ESIM-ADMIN] Erreur lors du chargement des eSIMs:', error);
        this.error = 'Erreur lors du chargement des eSIMs';
        this.loading = false;
        this.showMessage('error', 'Erreur', 'Impossible de charger les eSIMs. Veuillez réessayer.');
      }
    });
  }

  // Recherche avec debounce pour éviter trop d'appels API
  onSearchChange(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Attendre 500ms après que l'utilisateur arrête de taper
    this.searchTimeout = setTimeout(() => {
      this.page = 1; // Reset à la première page lors de la recherche
      this.loadEsims(1);
    }, 500);
  }

  // Pagination côté serveur - utiliser directement les eSIMs chargées
  get filteredEsims(): Esim[] {
    // Avec pagination côté serveur, on retourne directement les eSIMs chargées
    // La recherche et le filtrage sont gérés côté serveur
    return this.esims || [];
  }

  // Gérer le changement de page
  onPageChange(page: number): void {
    if (page >= 1 && (!this.pagination || page <= this.pagination.last_page)) {
      this.loadEsims(page);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Gérer le changement du nombre d'éléments par page
  onItemsPerPageChange(newItemsPerPage: string): void {
    const newPerPage = parseInt(newItemsPerPage, 10);
    if (newPerPage !== this.itemsPerPage && newPerPage > 0) {
      this.itemsPerPage = newPerPage;
      this.page = 1; // Reset à la première page
      this.loadEsims(1);
    }
  }

  editEsim(esim: Esim): void {
    this.selectedEsim = { ...esim };
    this.showEditModal = true;
  }

  getDateTimeLocalValue(dateString: string | null | undefined): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      // Format: YYYY-MM-DDTHH:mm
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (e) {
      return '';
    }
  }

  onDateTimeChange(value: string): void {
    if (this.selectedEsim) {
      this.selectedEsim.assigned_at = value || null;
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedEsim = null;
  }

  updateEsimStatus(): void {
    if (!this.selectedEsim) return;

    this.esimService.updateEsimStatus(this.selectedEsim.id, {
      is_assigned: this.selectedEsim.is_assigned,
      assigned_at: this.selectedEsim.assigned_at
    }).subscribe({
      next: (response) => {
        this.showMessage('success', 'Succès', 'Statut de l\'eSIM mis à jour avec succès.');
        this.loadEsims();
        this.closeEditModal();
      },
      error: (error) => {
        console.error('🔴 [ESIM-ADMIN] Erreur lors de la mise à jour:', error);
        this.showMessage('error', 'Erreur', 'Impossible de mettre à jour le statut de l\'eSIM.');
      }
    });
  }

  deleteEsim(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.esimService.deleteEsim(id).subscribe({
          next: () => {
            this.showMessage('success', 'Succès', 'eSIM supprimée avec succès.');
            this.loadEsims();
          },
          error: (error) => {
            console.error('🔴 [ESIM-ADMIN] Erreur lors de la suppression:', error);
            this.showMessage('error', 'Erreur', 'Impossible de supprimer l\'eSIM.');
          }
        });
      }
    });
  }

  copyToClipboard(text: string, fieldName: string = ''): void {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      this.copySuccess = true;
      this.showMessage('success', 'Copié !', `${fieldName || 'Texte'} copié dans le presse-papiers.`);
      setTimeout(() => {
        this.copySuccess = false;
      }, 2000);
    }).catch((err) => {
      console.error('Erreur lors de la copie:', err);
      this.showMessage('error', 'Erreur', 'Impossible de copier dans le presse-papiers.');
    });
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '-';
    }
  }

  getPackageName(esim: Esim): string {
    if (esim.esim_package?.name) {
      return esim.esim_package.name;
    }
    return 'Non assignée';
  }

  getPackageDestination(esim: Esim): string {
    if (esim.esim_package?.destination) {
      return esim.esim_package.destination;
    }
    return '-';
  }

  truncateText(text: string, maxLength: number = 20): string {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  getAssignmentBadgeClass(isAssigned: boolean): string {
    return isAssigned ? 'badge-assigned' : 'badge-unassigned';
  }

  showMessage(icon: 'success' | 'error' | 'warning' | 'info', title: string, text: string): void {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      confirmButtonColor: '#667eea',
      timer: icon === 'success' ? 2000 : undefined,
      showConfirmButton: icon !== 'success'
    });
  }

  /**
   * Générer les numéros de pages à afficher dans la pagination avec ellipsis
   */
  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    
    const current = this.pagination.current_page;
    const last = this.pagination.last_page;
    const pages: (number | -1)[] = [];
    
    // Si moins de 10 pages, afficher toutes
    if (last <= 10) {
      for (let i = 1; i <= last; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Toujours afficher la première page
    pages.push(1);
    
    // Calculer la plage autour de la page courante
    let start = Math.max(2, current - 2);
    let end = Math.min(last - 1, current + 2);
    
    // Ajuster la plage si elle est trop petite
    if (end - start < 4) {
      if (current <= 4) {
        start = 2;
        end = Math.min(6, last - 1);
      } else if (current >= last - 3) {
        start = Math.max(2, last - 5);
        end = last - 1;
      }
    }
    
    // Ajouter ellipsis avant si nécessaire
    if (start > 2) {
      pages.push(-1); // -1 représente l'ellipsis
    }
    
    // Ajouter les pages autour de la page courante
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Ajouter ellipsis après si nécessaire
    if (end < last - 1) {
      pages.push(-1); // -1 représente l'ellipsis
    }
    
    // Toujours afficher la dernière page
    if (last > 1) {
      pages.push(last);
    }
    
    return pages;
  }
} 