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
  filteredTemplates: any[] = [];
  selectedTemplates: Array<{ template_id: number; price: number; template?: any }> = [];
  loadingTemplates: boolean = false;
  loading: boolean = false;
  error: string = '';
  searchText: string = '';
  searchId: string = '';
  showActiveOnly: boolean = true;

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
    
    // Ne pas recharger - on garde toute la liste visible
    // L'admin peut filtrer manuellement
  }

  loadAvailableTemplates(): void {
    this.loadingTemplates = true;
    
    // Récupérer les templates depuis Console Connect API
    // (pas de filtre par pays - l'admin peut chercher dans toute la liste)
    const filters: any = {};
    
    // Filtre par statut si la checkbox est activée
    if (this.showActiveOnly) {
      filters.status = 'active';
    }
    
    console.log('🔍 loadAvailableTemplates: Récupération de TOUS les packages Console Connect', filters);
    
    this.destinationService.getPackagesFromConsoleConnect(filters).subscribe({
      next: (response: any) => {
        this.loadingTemplates = false;
        
        if (response && response.success && Array.isArray(response.templates)) {
          this.availableTemplates = response.templates;
          this.applyFilters();
          
          console.log(`✅ Templates Console Connect reçus pour ${this.countryCode}:`, {
            total_api: response.total || 0,
            filtered: this.availableTemplates.length,
            filters_applied: response.filters_applied
          });
          
          if (this.availableTemplates.length > 0) {
            console.log(`📋 Exemple template Console Connect:`, {
              id: this.availableTemplates[0].id,
              name: this.availableTemplates[0].name,
              status: this.availableTemplates[0].status,
              supported_countries: this.availableTemplates[0].supported_countries
            });
          }
        } else {
          console.warn('⚠️ Réponse invalide depuis Console Connect', response);
          this.availableTemplates = [];
          this.filteredTemplates = [];
        }
      },
      error: (error) => {
        this.loadingTemplates = false;
        console.error('❌ Erreur chargement templates Console Connect:', error);
        this.availableTemplates = [];
        this.filteredTemplates = [];
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de récupérer les templates depuis Console Connect',
          showConfirmButton: true
        });
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

  /**
   * Recherche directe d'un template par son ID Console Connect
   */
  searchByConsoleConnectId(): void {
    if (!this.searchId.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'ID manquant',
        text: 'Veuillez saisir un ID Console Connect'
      });
      return;
    }

    this.loadingTemplates = true;
    
    const filters: any = {
      search_id: this.searchId.trim(),
      status: 'active'
    };
    
    console.log('🔍 searchByConsoleConnectId: Recherche par ID', filters);
    
    this.destinationService.getPackagesFromConsoleConnect(filters).subscribe({
      next: (response: any) => {
        this.loadingTemplates = false;
        
        if (response && response.success && Array.isArray(response.templates)) {
          this.availableTemplates = response.templates;
          this.applyFilters();
          
          if (this.availableTemplates.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Aucun résultat',
              text: `Aucun template trouvé avec l'ID "${this.searchId}"`
            });
          } else {
            console.log(`✅ Template(s) trouvé(s):`, this.availableTemplates.length);
          }
        } else {
          this.availableTemplates = [];
          this.filteredTemplates = [];
        }
      },
      error: (error) => {
        this.loadingTemplates = false;
        console.error('❌ Erreur recherche par ID:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la recherche du template'
        });
      }
    });
  }

  applyFilters(): void {
    const searchText = this.searchText.trim().toLowerCase();
    const searchId = this.searchId.trim().toLowerCase();
    
    this.filteredTemplates = this.availableTemplates.filter((template) => {
      // Filtre par statut
      const status = (template.status || '').toString().toLowerCase();
      if (this.showActiveOnly && status && status !== 'active') {
        return false;
      }

      // Filtre par ID (recherche dans searchId input)
      if (searchId) {
        const idValue = (template.id || '').toString().toLowerCase();
        const telnaId = (template.telna_id || template.console_connect_id || '').toString().toLowerCase();
        if (!idValue.includes(searchId) && !telnaId.includes(searchId)) {
          return false;
        }
      }

      // Filtre par texte (recherche large)
      if (searchText) {
        const name = (template.name || template.plan_name || '').toLowerCase();
        const description = (template.description || '').toLowerCase();
        const dataLimit = (template.data_limit || template.data_mb || '').toString().toLowerCase();
        
        // Recherche dans les pays supportés
        let supportedCountriesText = '';
        if (template.supported_countries && Array.isArray(template.supported_countries)) {
          supportedCountriesText = template.supported_countries.map((c: any) => {
            if (typeof c === 'string') return c;
            return `${c.iso_alpha2 || ''} ${c.iso_alpha3 || ''} ${c.name || ''}`;
          }).join(' ').toLowerCase();
        }
        
        // Vérifier si le texte est trouvé dans au moins un champ
        const found = name.includes(searchText) || 
                      description.includes(searchText) || 
                      dataLimit.includes(searchText) || 
                      supportedCountriesText.includes(searchText);
        
        if (!found) {
          return false;
        }
      }

      return true;
    });
  }

  onFiltersChange(): void {
    // Recharger les templates depuis l'API avec le nouveau filtre
    this.loadAvailableTemplates();
  }

  getFilteredCount(): number {
    return this.filteredTemplates.length;
  }

  getTotalCount(): number {
    return this.availableTemplates.length;
  }

  getSelectedCount(): number {
    return this.selectedTemplates.length;
  }

  getTemplateDisplayName(template: any): string {
    return template.name || template.plan_name || `${(template.data_limit || template.data_mb / 1024)}GB`;
  }

  getTemplateDataLimit(template: any): number {
    if (template.data_limit) return template.data_limit;
    if (template.data_mb) return Math.round(template.data_mb / 1024 * 10) / 10;
    return 1;
  }

  getTemplateStatus(template: any): string {
    return (template.status || 'Inactive').toString();
  }

  getTemplateId(template: any): string {
    return (template.id || template.telna_id || template.console_connect_id || '').toString();
  }

  /**
   * Retourne un aperçu des pays supportés (3 premiers + compteur)
   */
  getSupportedCountriesPreview(template: any): string {
    if (!template.supported_countries || !Array.isArray(template.supported_countries) || template.supported_countries.length === 0) {
      return '';
    }

    const countries = template.supported_countries.slice(0, 3).map((c: any) => {
      if (typeof c === 'string') return c;
      return c.iso_alpha2 || c.iso_alpha3 || c.name || '';
    });

    let preview = countries.join(', ');
    if (template.supported_countries.length > 3) {
      preview += '...';
    }

    return `(${preview})`;
  }

  /**
   * Retourne le nombre de pays supportés
   */
  getSupportedCountriesCount(template: any): number {
    if (!template.supported_countries || !Array.isArray(template.supported_countries)) {
      return 0;
    }
    return template.supported_countries.length;
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
            title: '✅ Destination créée en brouillon !',
            html: `
              <p><strong>${response.packages_created} packages</strong> créés avec succès</p>
              <p style="color: #f59e0b; margin-top: 1rem;">
                <i class="fas fa-info-circle"></i>
                La destination est en <strong>mode brouillon</strong>
              </p>
              <p style="color: #64748b; font-size: 0.9rem;">
                Publiez-la pour la rendre visible sur le site public
              </p>
            `,
            confirmButtonColor: '#667eea',
            confirmButtonText: 'Voir les destinations'
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

