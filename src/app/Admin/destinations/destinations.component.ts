import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DestinationsService, Destination, DestinationStats, Package } from '../../services/destinations.service';
import { DestinationAdminService } from '../../services/destination-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css'
})
export class DestinationsComponent implements OnInit {
  
  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];
  stats: DestinationStats | null = null;
  loading = false;
  syncLoading = false;
  selectedDestination: Destination | null = null;
  showDetailsModal = false;
  showSyncModal = false;
  syncLimit = 20;
  errorMessage = '';
  successMessage = '';
  
  // 🔍 Filtres et recherche
  searchText = '';
  filterStatus: 'all' | 'draft' | 'published' = 'all';
  filterActive: 'all' | 'active' | 'inactive' = 'all';
  showFilters = false;

  constructor(
    private destinationsService: DestinationsService,
    private destinationAdminService: DestinationAdminService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = '';
    
    console.log('🔄 DestinationsComponent: Début loadData');
    
    this.destinationsService.getAdminData().subscribe({
      next: (response) => {
        console.log('✅ DestinationsComponent: Réponse reçue', response);
        if (response.success) {
          this.destinations = response.destinations;
          this.stats = response.stats;
          this.applyFilters(); // Appliquer les filtres après chargement
          console.log('📊 DestinationsComponent: Données chargées', {
            destinations: this.destinations.length,
            filtered: this.filteredDestinations.length,
            stats: this.stats
          });
        } else {
          console.error('❌ DestinationsComponent: Erreur dans la réponse', response);
          this.errorMessage = 'Erreur lors du chargement des données';
        }
      },
      error: (error) => {
        console.error('❌ DestinationsComponent: Erreur HTTP', error);
        console.error('📍 URL qui a échoué:', error.url);
        console.error('📊 Status:', error.status);
        console.error('📝 Message:', error.message);
        this.errorMessage = 'Erreur de connexion au serveur';
      },
      complete: () => {
        console.log('✅ DestinationsComponent: loadData terminé');
        this.loading = false;
      }
    });
  }

  syncDestinations(): void {
    this.syncLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.destinationsService.syncDestinations(this.syncLimit).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Synchronisation réussie !';
          this.showSyncModal = false;
          // Recharger les données après 2 secondes
          setTimeout(() => {
            this.loadData();
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Erreur lors de la synchronisation';
        }
      },
      error: (error) => {
        console.error('Erreur sync:', error);
        this.errorMessage = 'Erreur de connexion lors de la synchronisation';
      },
      complete: () => {
        this.syncLoading = false;
      }
    });
  }

  viewDestinationDetails(destination: Destination): void {
    this.selectedDestination = destination;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedDestination = null;
  }

  openSyncModal(): void {
    this.showSyncModal = true;
  }

  closeSyncModal(): void {
    this.showSyncModal = false;
  }

  getStockStatus(pkg: Package): { class: string, text: string, color: string } {
    if (pkg.available_esims === 0) {
      return { class: 'stock-out', text: 'Rupture', color: 'text-gray-500' };
    } else if (pkg.available_esims <= 2) {
      return { class: 'stock-low', text: 'Stock faible', color: 'text-red-500' };
    } else if (pkg.available_esims <= 5) {
      return { class: 'stock-medium', text: 'Stock moyen', color: 'text-yellow-500' };
    } else {
      return { class: 'stock-high', text: 'En stock', color: 'text-green-500' };
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  getOverallStatus(destination: Destination): { class: string, text: string, color: string } {
    const totalPackages = destination.packages.length;
    const availablePackages = destination.packages.filter(p => p.in_stock).length;
    
    if (availablePackages === 0) {
      return { class: 'stock-out', text: 'Rupture', color: 'text-gray-500' };
    } else if (availablePackages <= totalPackages * 0.3) {
      return { class: 'stock-low', text: 'Stock faible', color: 'text-red-500' };
    } else if (availablePackages <= totalPackages * 0.7) {
      return { class: 'stock-medium', text: 'Stock moyen', color: 'text-yellow-500' };
    } else {
      return { class: 'stock-high', text: 'En stock', color: 'text-green-500' };
    }
  }

  toggleDestinationVisibility(destination: Destination): void {
    if (!confirm(`Êtes-vous sûr de vouloir ${destination.is_published ? 'retirer' : 'publier'} cette destination du site web ?`)) {
      return;
    }

    this.destinationsService.toggleDestinationVisibility(destination.country_code).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.message;
          // Mettre à jour le statut localement
          destination.is_published = response.is_published;
          // Recharger les données après 1 seconde
          setTimeout(() => {
            this.loadData();
          }, 1000);
        } else {
          this.errorMessage = response.message || 'Erreur lors de la mise à jour';
        }
      },
      error: (error) => {
        console.error('Erreur toggle visibility:', error);
        this.errorMessage = 'Erreur de connexion lors de la mise à jour';
      }
    });
  }

  // 🚀 Publier une destination (brouillon → publié)
  publishDestination(destination: Destination): void {
    Swal.fire({
      title: 'Publier cette destination ?',
      html: `
        <p>Vous êtes sur le point de publier <strong>${destination.country_name}</strong>.</p>
        <p>Elle deviendra visible sur le site public.</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '🚀 Publier',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.destinationAdminService.publishDestination(destination.country_code).subscribe({
          next: (response) => {
            this.loading = false;
            if (response.success) {
              Swal.fire({
                icon: 'success',
                title: 'Destination publiée !',
                text: response.message,
                confirmButtonColor: '#667eea'
              });
              this.loadData(); // Recharger les données
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: response.message || 'Erreur lors de la publication'
              });
            }
          },
          error: (error) => {
            this.loading = false;
            console.error('❌ Erreur publication:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Erreur de connexion lors de la publication'
            });
          }
        });
      }
    });
  }

  // 🔍 Appliquer les filtres
  applyFilters(): void {
    let filtered = [...this.destinations];

    // Filtre par texte de recherche
    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(d => 
        d.country_name.toLowerCase().includes(search) ||
        d.country_code.toLowerCase().includes(search) ||
        d.network_provider?.toLowerCase().includes(search)
      );
    }

    // Filtre par statut de publication
    if (this.filterStatus === 'draft') {
      filtered = filtered.filter(d => !d.is_published);
    } else if (this.filterStatus === 'published') {
      filtered = filtered.filter(d => d.is_published);
    }

    // Filtre par statut actif
    if (this.filterActive === 'active') {
      filtered = filtered.filter(d => d.is_active);
    } else if (this.filterActive === 'inactive') {
      filtered = filtered.filter(d => !d.is_active);
    }

    this.filteredDestinations = filtered;
  }

  // 🎯 Réinitialiser les filtres
  resetFilters(): void {
    this.searchText = '';
    this.filterStatus = 'all';
    this.filterActive = 'all';
    this.applyFilters();
  }

  // 🎨 Helper pour les badges
  getPublishBadge(destination: Destination): { class: string, text: string, icon: string } {
    if (!destination.is_published) {
      return { 
        class: 'badge-draft', 
        text: 'Brouillon', 
        icon: 'fa-file-alt' 
      };
    }
    return { 
      class: 'badge-published', 
      text: 'Publié', 
      icon: 'fa-check-circle' 
    };
  }

  getActiveBadge(destination: Destination): { class: string, text: string } {
    return destination.is_active 
      ? { class: 'badge-active', text: 'Actif' }
      : { class: 'badge-inactive', text: 'Inactif' };
  }

  // 📊 Statistiques filtrées
  getFilteredStats() {
    return {
      total: this.filteredDestinations.length,
      draft: this.filteredDestinations.filter(d => !d.is_published).length,
      published: this.filteredDestinations.filter(d => d.is_published).length,
      active: this.filteredDestinations.filter(d => d.is_active).length
    };
  }

  // 🔢 Calculer le total d'eSIMs disponibles pour une destination
  getTotalAvailableEsims(destination: Destination): number {
    return destination.packages.reduce((sum, p) => sum + p.available_esims, 0);
  }

  // 🔢 Calculer le nombre de packages pour une destination
  getPackagesCount(destination: Destination): number {
    return destination.packages.length;
  }
}
