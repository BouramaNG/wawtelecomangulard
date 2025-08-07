import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DestinationsService, Destination, DestinationStats, Package } from '../../services/destinations.service';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css'
})
export class DestinationsComponent implements OnInit {
  
  destinations: Destination[] = [];
  stats: DestinationStats | null = null;
  loading = false;
  syncLoading = false;
  selectedDestination: Destination | null = null;
  showDetailsModal = false;
  showSyncModal = false;
  syncLimit = 20;
  errorMessage = '';
  successMessage = '';

  constructor(private destinationsService: DestinationsService) { }

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
          console.log('📊 DestinationsComponent: Données chargées', {
            destinations: this.destinations.length,
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
}
