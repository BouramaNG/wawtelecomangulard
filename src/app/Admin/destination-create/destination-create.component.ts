import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DestinationAdminService, CreateDestinationRequest } from '../../services/destination-admin.service';
import { EsimService } from '../../services/esim.service';

interface Country {
  code: string;
  name: string;
}

@Component({
  selector: 'app-destination-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './destination-create.component.html',
  styleUrl: './destination-create.component.css'
})
export class DestinationCreateComponent implements OnInit {
  countryCode: string = '';
  countryName: string = '';
  networkProvider: string = '';

  availableTemplates: any[] = [];
  selectedTemplates: Array<{ template_id: number; price: number; template?: any }> = [];
  loadingTemplates: boolean = false;
  loading: boolean = false;
  error: string = '';

  countries: Country[] = [
    { code: 'KR', name: 'Corée du Sud' },
    { code: 'FR', name: 'France' },
    { code: 'MA', name: 'Maroc' },
    { code: 'US', name: 'États-Unis' },
    { code: 'ES', name: 'Espagne' },
    { code: 'IT', name: 'Italie' },
    { code: 'AE', name: 'Émirats arabes unis' },
    { code: 'TR', name: 'Turquie' },
    { code: 'CN', name: 'Chine' },
    { code: 'ZA', name: 'Afrique du Sud' },
    { code: 'GB', name: 'Royaume-Uni' },
    { code: 'CI', name: 'Côte d\'Ivoire' },
    { code: 'CA', name: 'Canada' },
    { code: 'KE', name: 'Kenya' },
    { code: 'JP', name: 'Japon' },
    { code: 'DE', name: 'Allemagne' },
    { code: 'NL', name: 'Pays-Bas' },
    { code: 'BE', name: 'Belgique' },
    { code: 'CH', name: 'Suisse' },
    { code: 'AT', name: 'Autriche' },
    { code: 'SE', name: 'Suède' },
    { code: 'NO', name: 'Norvège' },
    { code: 'DK', name: 'Danemark' },
    { code: 'FI', name: 'Finlande' },
    { code: 'PL', name: 'Pologne' },
    { code: 'PT', name: 'Portugal' },
    { code: 'GR', name: 'Grèce' },
    { code: 'IE', name: 'Irlande' },
    { code: 'BR', name: 'Brésil' },
    { code: 'MX', name: 'Mexique' },
    { code: 'AR', name: 'Argentine' },
    { code: 'AU', name: 'Australie' },
    { code: 'NZ', name: 'Nouvelle-Zélande' },
    { code: 'SG', name: 'Singapour' },
    { code: 'MY', name: 'Malaisie' },
    { code: 'TH', name: 'Thaïlande' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'IN', name: 'Inde' },
    { code: 'ID', name: 'Indonésie' },
    { code: 'PH', name: 'Philippines' },
    { code: 'EG', name: 'Égypte' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'GH', name: 'Ghana' },
    { code: 'SN', name: 'Sénégal' },
    { code: 'SA', name: 'Arabie Saoudite' },
    { code: 'QA', name: 'Qatar' },
    { code: 'KW', name: 'Koweït' },
    { code: 'BH', name: 'Bahreïn' },
    { code: 'OM', name: 'Oman' },
    { code: 'JO', name: 'Jordanie' },
    { code: 'LB', name: 'Liban' },
    { code: 'IL', name: 'Israël' },
  ];

  constructor(
    private destinationService: DestinationAdminService,
    private esimService: EsimService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAvailableTemplates();
  }

  onCountryChange(): void {
    const selectedCountry = this.countries.find(c => c.code === this.countryCode);
    if (selectedCountry) {
      this.countryName = selectedCountry.name;
    }
    
    // Réinitialiser les templates sélectionnés
    this.selectedTemplates = [];
    
    // Recharger les templates pour le nouveau pays
    this.loadAvailableTemplates();
  }

  loadAvailableTemplates(): void {
    // Ne charger que si un pays est sélectionné
    if (!this.countryCode) {
      this.availableTemplates = [];
      return;
    }

    this.loadingTemplates = true;
    
    // Filtrer les templates par code pays
    const params: any = { 
      per_page: 500, 
      status: 'Active',
      country_code: this.countryCode.toUpperCase()
    };
    
    this.esimService.listEsimPackageTemplates(params).subscribe({
      next: (response: any) => {
        this.loadingTemplates = false;
        let templates: any[] = [];
        
        if (response && response.templates && Array.isArray(response.templates)) {
          templates = response.templates;
        } else if (response && response.packages && Array.isArray(response.packages)) {
          templates = response.packages;
        }
        
        // L'API filtre déjà par pays (avec conversion Alpha-2/Alpha-3), 
        // donc on garde tous les templates retournés
        this.availableTemplates = templates;
        
        console.log(`✅ Templates reçus pour ${this.countryCode}:`, this.availableTemplates.length);
        if (this.availableTemplates.length > 0) {
          console.log(`📋 Exemple template:`, {
            id: this.availableTemplates[0].id,
            name: this.availableTemplates[0].name,
            country_code: this.availableTemplates[0].country_code
          });
        }
      },
      error: (error) => {
        this.loadingTemplates = false;
        console.error('Erreur chargement templates:', error);
        this.availableTemplates = [];
      }
    });
  }

  toggleTemplateSelection(template: any): void {
    const index = this.selectedTemplates.findIndex(st => st.template_id === template.id);
    if (index >= 0) {
      this.selectedTemplates.splice(index, 1);
    } else {
      this.selectedTemplates.push({
        template_id: template.id,
        price: 0,
        template: template
      });
    }
  }

  isTemplateSelected(templateId: number): boolean {
    return this.selectedTemplates.some(st => st.template_id === templateId);
  }

  getSelectedTemplatePrice(templateId: number): number {
    const selected = this.selectedTemplates.find(st => st.template_id === templateId);
    return selected ? selected.price : 0;
  }

  updateTemplatePrice(templateId: number, price: number): void {
    const selected = this.selectedTemplates.find(st => st.template_id === templateId);
    if (selected) {
      selected.price = price || 0;
    }
  }

  getTemplateDisplayName(template: any): string {
    return template.name || template.plan_name || `${(template.data_limit || template.data_mb / 1024)}GB`;
  }

  getTemplateDataLimit(template: any): number {
    if (template.data_limit) return template.data_limit;
    if (template.data_mb) return Math.round(template.data_mb / 1024 * 10) / 10;
    return 1;
  }

  validateForm(): boolean {
    if (!this.countryCode || !this.countryName) {
      this.error = 'Le code pays et le nom sont requis';
      return false;
    }
    if (this.countryCode.length !== 2) {
      this.error = 'Le code pays doit être de 2 lettres';
      return false;
    }
    if (this.selectedTemplates.length === 0) {
      this.error = 'Veuillez sélectionner au moins un template';
      return false;
    }
    const invalidTemplates = this.selectedTemplates.filter(st => !st.price || st.price <= 0);
    if (invalidTemplates.length > 0) {
      this.error = 'Tous les templates sélectionnés doivent avoir un prix supérieur à 0';
      return false;
    }
    this.error = '';
    return true;
  }

  async submitForm(): Promise<void> {
    if (!this.validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur de validation',
        text: this.error
      });
      return;
    }

    this.loading = true;
    this.error = '';

    const request: CreateDestinationRequest = {
      country_code: this.countryCode.toUpperCase(),
      country_name: this.countryName,
      network_provider: this.networkProvider || undefined,
      selected_templates: this.selectedTemplates.map(st => ({
        template_id: st.template_id,
        price: st.price
      }))
    };

    this.destinationService.createDestination(request).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Destination créée !',
            text: `${response.packages_created} packages créés avec succès`,
            confirmButtonColor: '#667eea'
          }).then(() => {
            this.router.navigate(['/admin/destinations']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: response.message || 'Erreur lors de la création'
          });
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Erreur création destination:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: error.error?.message || 'Erreur lors de la création de la destination'
        });
      }
    });
  }

  cancel(): void {
    Swal.fire({
      title: 'Annuler ?',
      text: 'Les modifications non enregistrées seront perdues',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non, continuer'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/admin/destinations']);
      }
    });
  }
}

