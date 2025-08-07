import { Component, OnInit } from '@angular/core';
import { ConsoleConnectAdminService, ConsoleConnectResponse } from '../../services/console-connect-admin.service';
import { EsimService } from '../../services/esim.service';

@Component({
  selector: 'app-console-connect',
  templateUrl: './console-connect.component.html',
  styleUrls: ['./console-connect.component.css']
})
export class ConsoleConnectComponent implements OnInit {
  // Données
  esims: any[] = [];
  packages: any[] = [];
  
  // État de chargement
  loading = false;
  error = '';
  success = '';
  
  // Statistiques du stock eSIM
  stockStats: any = {};
  loadingStockStats = false;
  
  // Filtres
  _esimStatusFilter = '';
  get esimStatusFilter() {
    return this._esimStatusFilter;
  }
  set esimStatusFilter(val: string) {
    this._esimStatusFilter = val;
    this.currentPage = 1;
  }

  _packageDestinationFilter = '';
  get packageDestinationFilter() {
    return this._packageDestinationFilter;
  }
  set packageDestinationFilter(val: string) {
    this._packageDestinationFilter = val;
    this.currentPage = 1;
  }
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  
  // Statistiques
  stats: any = {};
  apiInfo: any = {};

  // Modal de détails
  showDetailsModal = false;
  selectedEsim: any = null;
  esimDetails: any = null;
  loadingDetails = false;

  // QR Code
  showQrCode = false;
  qrCodeData = '';
  qrCodeUrl = '';

  // Propriété JSON pour le template
  JSON = JSON;

  constructor(
    private consoleConnectService: ConsoleConnectAdminService,
    private esimService: EsimService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadStockStats();
  }

  loadStockStats(): void {
    this.loadingStockStats = true;
    this.esimService.getEsimStockStats().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.stockStats = response.stats;
        }
        this.loadingStockStats = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques du stock:', err);
        this.loadingStockStats = false;
      }
    });
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.consoleConnectService.getEsimsFromConsoleConnect().subscribe({
      next: (response: ConsoleConnectResponse) => {
        this.esims = response.esims || [];
        this.packages = response.packages || [];
        this.stats = response.stats || {};
        this.apiInfo = response.api_info || {};
        
        this.success = `Données chargées avec succès: ${this.esims.length} eSIMs, ${this.packages.length} packages`;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = `Erreur lors du chargement: ${err.message}`;
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.currentPage = 1;
    this.loadData();
    this.loadStockStats();
  }

  getStatusItems(): any[] {
    if (!this.stockStats?.by_status) return [];
    
    return Object.entries(this.stockStats.by_status).map(([key, value]: [string, any]) => ({
      key: key,
      value: value.count || 0
    }));
  }

  // Getters pour la pagination
  get paginatedEsims(): any[] {
    const filtered = this.esims.filter(esim => 
      !this.esimStatusFilter || 
      (esim.status && esim.status.toLowerCase().includes(this.esimStatusFilter.toLowerCase()))
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageEsims = filtered.slice(start, end);
    console.log('[paginatedEsims] page', this.currentPage, '/', this.totalPages, '| ICCID:', pageEsims.map(e => e.iccid));
    return pageEsims;
  }

  get paginatedPackages(): any[] {
    const filtered = this.packages.filter(pkg => 
      !this.packageDestinationFilter || 
      (pkg.destination && pkg.destination.toLowerCase().includes(this.packageDestinationFilter.toLowerCase()))
    );
    
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filtered.slice(start, end);
  }

  get totalPages(): number {
    const filteredEsims = this.esims.filter(esim => 
      !this.esimStatusFilter || 
      (esim.status && esim.status.toLowerCase().includes(this.esimStatusFilter.toLowerCase()))
    );
    return Math.ceil(filteredEsims.length / this.itemsPerPage);
  }

  // Navigation
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      console.log('Page changée:', this.currentPage, 'eSIMs affichées:', this.paginatedEsims.map(e => e.iccid));
    }
  }

  // Méthodes utilitaires
  formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Actif',
      'inactive': 'Inactif',
      'pending': 'En attente',
      'expired': 'Expiré',
      'unknown': 'Inconnu'
    };
    return statusMap[status] || status;
  }

  formatDestination(destination: string): string {
    const destinationMap: { [key: string]: string } = {
      'europe': 'Europe',
      'asia': 'Asie',
      'america': 'Amérique',
      'africa': 'Afrique',
      'global': 'Global',
      'unknown': 'Inconnu'
    };
    return destinationMap[destination] || destination;
  }

  formatDataLimit(dataLimit: any): string {
    if (!dataLimit) return 'Non spécifié';
    if (typeof dataLimit === 'number') {
      return `${dataLimit} MB`;
    }
    return dataLimit.toString();
  }

  formatPrice(price: any, currency: string = 'EUR'): string {
    if (!price) return 'Non spécifié';
    return `${price} ${currency}`;
  }

  formatDate(date: any): string {
    if (!date) return 'Non spécifié';
    return new Date(date).toLocaleString('fr-FR');
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      'active': 'status-active',
      'inactive': 'status-inactive',
      'pending': 'status-pending',
      'expired': 'status-expired',
      'unknown': 'status-unknown'
    };
    return classMap[status] || 'status-unknown';
  }

  getEuiccStateClass(state: string): string {
    const classMap: { [key: string]: string } = {
      'enabled': 'status-active',
      'disabled': 'status-disabled',
      'active': 'status-active',
      'inactive': 'status-inactive',
      'pending': 'status-pending',
      'expired': 'status-expired',
      'unknown': 'status-unknown'
    };
    return classMap[state.toLowerCase()] || 'status-unknown';
  }

  // Actions
  viewEsimDetails(esim: any): void {
    this.selectedEsim = esim;
    this.showDetailsModal = true;
    this.loadingDetails = true;
    this.esimDetails = null;

    // Récupérer les détails depuis l'API
    this.consoleConnectService.getEsimDetails(esim.id).subscribe({
      next: (response: any) => {
        // La réponse peut contenir 'esim' ou être directement les détails
        this.esimDetails = response.esim || response;
        this.loadingDetails = false;
        console.log('Détails eSIM récupérés:', this.esimDetails);
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des détails:', err);
        this.loadingDetails = false;
        this.esimDetails = null;
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedEsim = null;
    this.esimDetails = null;
  }

  // Méthodes pour extraire les informations spécifiques
  getLpaCode(): string {
    if (!this.esimDetails) return 'Non disponible';
    
    return this.esimDetails.activation_code || 'Non disponible';
  }

  getEuiccState(): string {
    if (!this.esimDetails) return 'Non disponible';
    
    return this.esimDetails.state || 'Non disponible';
  }

  getLastOperationDate(): string {
    if (!this.esimDetails) return 'Non disponible';
    
    if (this.esimDetails.last_operation_date_formatted) {
      return this.esimDetails.last_operation_date_formatted;
    }
    
    if (this.esimDetails.last_operation_date) {
      return new Date(this.esimDetails.last_operation_date).toLocaleString('fr-FR');
    }
    
    return 'Non disponible';
  }

  getReuseRemainingCount(): string {
    if (!this.esimDetails) return 'Non disponible';
    
    return this.esimDetails.reuse_remaining_count !== undefined ? this.esimDetails.reuse_remaining_count.toString() : 'Non disponible';
  }

  getEid(): string {
    if (!this.esimDetails) return 'Non disponible';
    
    return this.esimDetails.eid || 'Non disponible';
  }

  getImsi(): string {
    if (!this.esimDetails) return 'Non disponible';
    
    return this.esimDetails.imsi || 'Non disponible';
  }

  getReuseEnabled(): string {
    if (!this.esimDetails) return 'Non disponible';
    
    return this.esimDetails.reuse_enabled ? 'Oui' : 'Non';
  }

  getCcRequired(): string {
    if (!this.esimDetails) return 'Non disponible';
    
    return this.esimDetails.cc_required ? 'Oui' : 'Non';
  }

  getReleaseDate(): string {
    if (!this.esimDetails) return 'Non disponible';
    
    if (this.esimDetails.release_date_formatted) {
      return this.esimDetails.release_date_formatted;
    }
    
    if (this.esimDetails.release_date) {
      return new Date(this.esimDetails.release_date).toLocaleString('fr-FR');
    }
    
    return 'Non disponible';
  }

  getProfileReusePolicy(): any {
    if (!this.esimDetails) return null;
    
    return this.esimDetails.profile_reuse_policy || null;
  }

  viewPackageDetails(pkg: any): void {
    console.log('Détails package:', pkg);
    // Ici vous pouvez implémenter l'affichage des détails
  }

  // Méthodes pour le QR Code
  generateQrCode(): void {
    const lpaCode = this.getLpaCode();
    if (lpaCode && lpaCode !== 'Non disponible') {
      this.qrCodeData = lpaCode;
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(lpaCode)}`;
      this.showQrCode = true;
    }
  }

  hideQrCode(): void {
    this.showQrCode = false;
    this.qrCodeData = '';
    this.qrCodeUrl = '';
  }

  copyLpaCode(): void {
    const lpaCode = this.getLpaCode();
    if (lpaCode && lpaCode !== 'Non disponible') {
      navigator.clipboard.writeText(lpaCode).then(() => {
        // Optionnel : afficher un message de confirmation
        console.log('Code LPA copié dans le presse-papiers');
      });
    }
  }

  // Getter pour le debug pagination
  get filteredEsimsCount(): number {
    return this.esims.filter(esim =>
      !this.esimStatusFilter ||
      (esim.status && esim.status.toLowerCase().includes(this.esimStatusFilter.toLowerCase()))
    ).length;
  }

  // Getter pour debug pagination (liste des ICCID affichés)
  get paginatedEsimsIccids(): string {
    return this.paginatedEsims.map(e => e.iccid).join(', ');
  }
} 