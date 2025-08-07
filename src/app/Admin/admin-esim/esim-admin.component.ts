import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  constructor(private esimService: EsimAdminService) { }

  ngOnInit(): void {
    this.loadEsims();
  }

  loadEsims(): void {
    this.loading = true;
    this.error = '';

    this.esimService.getEsims().subscribe({
      next: (response) => {
        this.esims = response.esims;
        this.stats = response.stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des eSIMs:', error);
        this.error = 'Erreur lors du chargement des eSIMs';
        this.loading = false;
      }
    });
  }

  get filteredEsims(): Esim[] {
    let filtered = this.esims;

    if (this.searchTerm) {
      filtered = filtered.filter(esim => 
        esim.iccid.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        esim.activation_code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        esim.lpa.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }

  editEsim(esim: Esim): void {
    this.selectedEsim = { ...esim };
    this.showEditModal = true;
  }

  updateEsimStatus(): void {
    if (!this.selectedEsim) return;

    this.esimService.updateEsimStatus(this.selectedEsim.id, {
      is_assigned: this.selectedEsim.is_assigned,
      assigned_at: this.selectedEsim.assigned_at
    }).subscribe({
      next: (response) => {
        this.loadEsims();
        this.showEditModal = false;
        this.selectedEsim = null;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        this.error = 'Erreur lors de la mise à jour du statut';
      }
    });
  }

  deleteEsim(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette eSIM ?')) {
      this.esimService.deleteEsim(id).subscribe({
        next: () => {
          this.loadEsims();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.error = 'Erreur lors de la suppression';
        }
      });
    }
  }



  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // Optionnel: afficher un message de confirmation
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 