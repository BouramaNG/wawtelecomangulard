import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { StatComponent } from '../../partials/stat/stat.component';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

// Interfaces TypeScript pour le typage
interface Commande {
  id: number;
  order?: {
    id: number;
    user?: {
      name: string;
      email: string;
      phone?: string;
    };
    esim_package?: {
      plan_name: string;
      country_name: string;
      data_limit: string;
      validity_days: number;
    };
    esim?: {
      iccid: string;
      activation_code: string;
      status: string;
    };
    amount: number;
    status: string;
    created_at: string;
    email?: string;
    phone_number?: string;
    ref_command?: string;
    payment_method?: string;
    esim_package_template?: {
      id: number;
      name: string;
      country: string;
      country_code: string;
      telna_id: number;
      data_mb: number;
      status: string;
      created_at: string;
      updated_at: string;
    };
  };
  amount: number;
  provider: string;
  transaction_reference: string;
  payment_status: string;
  created_at: string;
}

interface Statistiques {
  totalCommandes: number;
  commandesAujourdhui: number;
  revenusTotal: number;
  revenusAujourdhui: number;
  tauxReussite: number;
}

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, StatComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './commande.component.html',
  styleUrl: './commande.component.css'
})
export class CommandeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Données
  commandes: Commande[] = [];
  commandesFiltrees: Commande[] = [];
  
  // Pagination
  page: number = 1;
  itemsPerPage: number = 10;
  
  // Filtres
  recherche: string = '';
  filtreStatut: string = '';
  filtreDate: string = '';
  filtrePays: string = '';
  
  // Statistiques
  statistiques: Statistiques = {
    totalCommandes: 0,
    commandesAujourdhui: 0,
    revenusTotal: 0,
    revenusAujourdhui: 0,
    tauxReussite: 0
  };
  
  // États
  loading: boolean = false;
  error: string = '';
  
  // Options de filtres
  statuts = [
    { value: '', label: 'Tous les statuts' },
    { value: 'success', label: 'Réussi' },
    { value: 'echec', label: 'Échec' },
    { value: 'Annulée', label: 'Annulée' }
  ];
  
  pays = [
    { value: '', label: 'Tous les pays' },
    { value: 'France', label: 'France' },
    { value: 'Maroc', label: 'Maroc' },
    { value: 'Sénégal', label: 'Sénégal' }
  ];

  // Ajout pour le modal de détails
  selectedCommande: Commande | null = null;
  showDetailModal: boolean = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.chargerCommandes();
    this.setupRecherche();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupRecherche(): void {
    // Recherche avec debounce pour éviter trop d'appels
    // (sera implémenté avec un Observable si nécessaire)
  }

  chargerCommandes(): void {
    this.loading = true;
    this.error = '';

    this.orderService.listePaiement().subscribe({
      next: (response: any) => {
        this.commandes = response.payments || [];
        this.commandesFiltrees = [...this.commandes];
        this.calculerStatistiques();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des commandes';
        this.loading = false;
        console.error('Erreur chargement commandes:', error);
      }
    });
  }

  appliquerFiltres(): void {
    this.commandesFiltrees = this.commandes.filter(commande => {
      const matchRecherche = !this.recherche || 
        commande.order?.user?.name?.toLowerCase().includes(this.recherche.toLowerCase()) ||
        commande.order?.user?.email?.toLowerCase().includes(this.recherche.toLowerCase()) ||
        commande.transaction_reference?.toLowerCase().includes(this.recherche.toLowerCase());

      const matchStatut = !this.filtreStatut || commande.payment_status === this.filtreStatut;
      const matchPays = !this.filtrePays || commande.order?.esim_package?.country_name === this.filtrePays;

      return matchRecherche && matchStatut && matchPays;
    });

    this.page = 1; // Retour à la première page
    this.calculerStatistiques();
  }

  reinitialiserFiltres(): void {
    this.recherche = '';
    this.filtreStatut = '';
    this.filtreDate = '';
    this.filtrePays = '';
    this.appliquerFiltres();
  }

  private calculerStatistiques(): void {
    const aujourdhui = new Date().toDateString();
    this.statistiques = {
      totalCommandes: this.commandesFiltrees.length,
      commandesAujourdhui: this.commandesFiltrees.filter(c => 
        new Date(c.created_at).toDateString() === aujourdhui
      ).length,
      revenusTotal: this.commandesFiltrees.reduce((sum, c) => sum + (Number(c.amount) || Number(c.order?.amount) || 0), 0),
      revenusAujourdhui: this.commandesFiltrees
        .filter(c => new Date(c.created_at).toDateString() === aujourdhui)
        .reduce((sum, c) => sum + (Number(c.amount) || Number(c.order?.amount) || 0), 0),
      tauxReussite: this.commandesFiltrees.length > 0 ? 
        (this.commandesFiltrees.filter(c => c.payment_status === 'success').length / this.commandesFiltrees.length) * 100 : 0
    };
  }

  getStatutClass(statut: string): string {
    switch(statut?.toLowerCase()) {
      case 'success': return 'badge-success';
      case 'echec': return 'badge-danger';
      case 'annulée': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

  getStatutLabel(statut: string): string {
    switch(statut?.toLowerCase()) {
      case 'success': return 'Réussi';
      case 'echec': return 'Échec';
      case 'annulée': return 'Annulée';
      default: return statut || 'Inconnu';
    }
  }

  formaterPrix(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(montant);
  }

  formaterDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  voirDetails(commande: Commande): void {
    console.log('Détail sélectionné:', commande);
    console.log('Order:', commande.order);
    console.log('eSIM:', commande.order?.esim);
    console.log('Template:', commande.order?.esim_package_template);
    this.selectedCommande = commande;
    this.showDetailModal = true;
  }

  fermerDetailModal(): void {
    this.showDetailModal = false;
    this.selectedCommande = null;
  }

  renvoyerEmail(commande: Commande): void {
    // TODO: Implémenter renvoi d'email
    console.log('Renvoyer email pour:', commande);
  }

  exporterDonnees(): void {
    // TODO: Implémenter export CSV/Excel
    console.log('Export des données');
  }

  // Fonction utilitaire pour le template
  get Math() {
    return Math;
  }
}
