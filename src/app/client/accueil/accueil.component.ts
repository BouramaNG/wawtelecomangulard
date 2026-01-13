import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../partials/header/header.component";
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ContactService } from '../../services/contact.service';
import { EsimService } from '../../services/esim.service';
import { OrderService } from '../../services/order.service';
import { EncryptionService } from '../../services/encryption.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DestinationsService } from '../../services/destinations.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [HeaderComponent, RouterLink, NgxPaginationModule, CommonModule, TranslateModule, FormsModule, NgSelectModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit{
  searchText: any;
  filteredEsims: any[]=[];

  pays: any[] = [
    {
      "id": 1,
      "nom": "France",
      "drapeau": "https://flagcdn.com/w320/fr.png",
      "continent": "Europe",
      "country_code":"FR"
    },
    {
      "id": 2,
      "nom": "Maroc",
      "drapeau": "https://flagcdn.com/w320/ma.png",
      "continent": "Afrique",
      "country_code":"MA"
    },
    {
      "id": 3,
      "nom": "États-Unis",
      "drapeau": "https://flagcdn.com/w320/us.png",
      "continent": "Amerique du Nord",
      "country_code":"US"
    },
    {
      "id": 4,
      "nom": "Espagne",
      "drapeau": "https://flagcdn.com/w320/es.png",
      "continent": "Europe",
      "country_code":"ES"
    },
    {
      "id": 5,
      "nom": "Italie",
      "drapeau": "https://flagcdn.com/w320/it.png",
      "continent": "Europe",
      "country_code":"IT"
    },
    {
      "id": 6,
      "nom": "Émirats arabes unis",
      "drapeau": "https://flagcdn.com/w320/ae.png",
      "continent": "Asie",
      "country_code":"AE"
    },
    {
      "id": 7,
      "nom": "Turquie",
      "drapeau": "https://flagcdn.com/w320/tr.png",
      "continent": "Europe",
      "country_code":"TR"
    },
    {
      "id": 8,
      "nom": "Chine",
      "drapeau": "https://flagcdn.com/w320/cn.png",
      "continent": "Asie",
      "country_code":"CN"
    },
    {
      "id": 9,
      "nom": "Afrique du Sud",
      "drapeau": "https://flagcdn.com/w320/za.png",
      "continent": "Afrique",
      "country_code":"ZA"
    },
    {
      "id": 10,
      "nom": "Royaume-Uni",
      "drapeau": "https://flagcdn.com/w320/gb.png",
      "continent": "Europe",
      "country_code":"GB"
    },
    {
      "id": 11,
      "nom": "Côte d'Ivoire",
      "drapeau": "https://flagcdn.com/w320/ci.png",
      "continent": "Afrique",
      "country_code":"CI"
    },
    {
      "id": 12,
      "nom": "Canada",
      "drapeau": "https://flagcdn.com/w320/ca.png",
      "continent": "Amerique du Nord",
      "country_code":"CA"
    },
    {
      "id": 13,
      "nom": "Kenya",
      "drapeau": "https://flagcdn.com/w320/ke.png",
      "continent": "Afrique",
      "country_code":"KE"
    },
    {
      "id": 14,
      "nom": "Koweït",
      "drapeau": "https://flagcdn.com/w320/kw.png",
      "continent": "Asie",
      "country_code":"KW"
    }
  ]
  
  page=1;
  items:any;
selectedContinent: any;
showModal = false;
destinationsWithPackages: any[] = [];
loadingPackages: { [key: number]: boolean } = {};
showCheckoutModal = false;
selectedPackage: any = null;
selectedDestination: any = null;
email: any;
phone: any;
user: any;
selectedIndicatif: any = '+221';
comande: any;
idOrder: any;

indicatifs = [
  { "ind": "+33", "drapeau": "https://flagcdn.com/w320/fr.png" },
  { "ind": "+221", "drapeau": "https://flagcdn.com/w320/sn.png" },
  { "ind": "+212", "drapeau": "https://flagcdn.com/w320/ma.png" },
  { "ind": "+1", "drapeau": "https://flagcdn.com/w320/us.png" },
  { "ind": "+34", "drapeau": "https://flagcdn.com/w320/es.png" },
  { "ind": "+39", "drapeau": "https://flagcdn.com/w320/it.png" },
  { "ind": "+44", "drapeau": "https://flagcdn.com/w320/gb.png" },
  { "ind": "+225", "drapeau": "https://flagcdn.com/w320/ci.png" },
  { "ind": "+254", "drapeau": "https://flagcdn.com/w320/ke.png" },
  { "ind": "+27", "drapeau": "https://flagcdn.com/w320/za.png" },
];

constructor(
  private contactService:ContactService,
  private esimService: EsimService,
  private orderService: OrderService,
  private encryptionService: EncryptionService,
  private destinationsService: DestinationsService
){}

  ngOnInit(): void {
    this.filteredEsims = this.pays;
    this.loadDestinationsFromAPI();
    this.loadPackagesForDestinations();

    setTimeout(() => {
      this.showModal = true;
    }, 1000); // 3 secondes après le chargement
  }

  loadDestinationsFromAPI() {
    this.destinationsService.getDestinations().pipe(
      catchError(error => {
        return of({ success: false, destinations: [] });
      })
    ).subscribe((response: any) => {
      if (response && response.success && response.destinations && response.destinations.length > 0) {
        // Créer un map des codes pays statiques pour recherche rapide
        const staticMap = new Map(this.pays.map((p: any) => [p.country_code, p]));
        const newDestinations: any[] = [];
        
        // Traiter chaque destination de l'API
        response.destinations.forEach((dest: any, index: number) => {
          const existingDest = staticMap.get(dest.country_code);
          
          if (existingDest) {
            // Mettre à jour la destination statique existante avec les packages de l'API
            existingDest.packages = (dest.packages || []).map((pkg: any) => ({
              id: pkg.id,
              name: pkg.plan_name,
              data_mb: (pkg.data_limit || 0) * 1024, // Convertir GB en MB
              price: pkg.price,
              duration_days: pkg.validity_days,
              image: pkg.image
            }));
          } else {
            // Ajouter une nouvelle destination depuis l'API (non présente dans statique)
            const newDest = {
              id: 1000 + index, // ID élevé pour éviter les conflits
              nom: dest.country_name,
              drapeau: dest.packages && dest.packages.length > 0 
                ? dest.packages[0].image 
                : `https://flagcdn.com/w320/${dest.country_code.toLowerCase()}.png`,
              continent: this.getContinentFromCode(dest.country_code),
              country_code: dest.country_code,
              packages: (dest.packages || []).map((pkg: any) => ({
                id: pkg.id,
                name: pkg.plan_name,
                data_mb: (pkg.data_limit || 0) * 1024, // Convertir GB en MB
                price: pkg.price,
                duration_days: pkg.validity_days,
                image: pkg.image
              }))
            };
            
            newDestinations.push(newDest);
            staticMap.set(dest.country_code, newDest);
          }
        });
        
        // Ajouter les nouvelles destinations AU DÉBUT du tableau pour qu'elles soient visibles
        if (newDestinations.length > 0) {
          this.pays = [...newDestinations, ...this.pays];
        }
        
        // Mettre à jour filteredEsims
        this.filteredEsims = this.pays;
      }
    });
  }

  getContinentFromCode(countryCode: string): string {
    // Mapping simple des codes pays aux continents
    const continentMap: { [key: string]: string } = {
      'KW': 'Asie',
      'DE': 'Europe',
      'FR': 'Europe',
      'MA': 'Afrique',
      'US': 'Amerique du Nord',
      'ES': 'Europe',
      'IT': 'Europe',
      'AE': 'Asie',
      'TR': 'Europe',
      'CN': 'Asie',
      'ZA': 'Afrique',
      'GB': 'Europe',
      'CI': 'Afrique',
      'CA': 'Amerique du Nord',
      'KE': 'Afrique'
    };
    return continentMap[countryCode] || 'Asie';
  }

  loadPackagesForDestinations() {
    // Charger les forfaits pour les 8 premières destinations
    const destinationsToLoad = this.pays.slice(0, 8);
    
    destinationsToLoad.forEach((destination: any) => {
      this.loadingPackages[destination.id] = true;
      
      this.esimService.getEsimPackagesWithPrice(destination.country_code).pipe(
        catchError(error => {
          // Erreur silencieuse pour le chargement des packages
          return of({ success: false, packages: [] });
        })
      ).subscribe((response: any) => {
        this.loadingPackages[destination.id] = false;
        
        if (response && response.success && response.packages) {
          // Filtrer les packages TEST et Turky, et dédupliquer
          const filteredPackages = response.packages
            .filter((pkg: any) => 
              !pkg.name?.includes('TEST') && 
              !pkg.name?.includes('Turky')
            )
            .reduce((acc: any[], pkg: any) => {
              const existing = acc.find((p: any) => 
                p.name === pkg.name && p.data_mb === pkg.data_mb
              );
              if (!existing) {
                acc.push(pkg);
              }
              return acc;
            }, [])
            .slice(0, 3); // Limiter à 3 forfaits par destination
          
          (destination as any).packages = filteredPackages;
        } else {
          (destination as any).packages = [];
        }
      });
    });
  }

  getPackagesForDestination(destinationId: number): any[] {
    const destination = this.pays.find((p: any) => p.id === destinationId) as any;
    return destination?.packages || [];
  }

  getItemPackages(item: any): any[] {
    return item?.packages || [];
  }

  hasPackages(item: any): boolean {
    return item?.packages && item.packages.length > 0;
  }

  getPackagesCount(item: any): number {
    return item?.packages?.length || 0;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price);
  }

  formatDataSize(dataMb: number): string {
    if (dataMb >= 1024) {
      return `${(dataMb / 1024).toFixed(1)} GB`;
    }
    return `${dataMb} MB`;
  }

  openCheckoutModal(pkg: any, destination: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = this.encryptionService.decryptData(token);
        this.user = decoded;
      } catch (e) {
        // Erreur silencieuse de décryptage
      }
    }
    
    this.selectedPackage = pkg;
    this.selectedDestination = destination;
    this.showCheckoutModal = true;
  }

  closeCheckoutModal() {
    this.showCheckoutModal = false;
    this.selectedPackage = null;
    this.selectedDestination = null;
    this.email = '';
    this.phone = '';
  }

  order() {
    if (!this.email || !this.phone || !this.selectedPackage?.id || !this.selectedPackage?.price) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez remplir tous les champs obligatoires !",
        confirmButtonColor: '#FFDD33'
      });
      return;
    }
    
    const com = {
      email: this.email,
      phone_number: this.selectedIndicatif + this.phone,
      user_id: this.user?.id,
      esim_package_template_id: this.selectedPackage.id,
      amount: this.selectedPackage.price,
    };
    
    this.orderService.commande(com).subscribe({
      next: (response: any) => {
        this.comande = response;
        this.idOrder = response.order.id;
        this.closeCheckoutModal();
        
        // Afficher un message de chargement
        Swal.fire({
          title: "Redirection en cours...",
          text: "Préparation de votre paiement sécurisé",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Initier directement le paiement
        this.orderService.payer(this.idOrder).subscribe({
          next: (reponse: any) => {
            if (reponse && reponse.redirect_url) {
              // Rediriger directement vers PayTech
              window.location.href = reponse.redirect_url;
            } else {
              Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Impossible de rediriger vers le paiement. Veuillez réessayer.",
                confirmButtonColor: '#FFDD33'
              });
            }
          },
          error: (error: any) => {
            // Erreur silencieuse lors du paiement
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: error.error?.message || "Une erreur est survenue lors du paiement.",
              confirmButtonColor: '#FFDD33'
            });
          }
        });
      },
      error: (error: any) => {
        // Erreur silencieuse lors de la commande
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: error.error?.message || "Une erreur est survenue lors de la création de la commande.",
          confirmButtonColor: '#FFDD33'
        });
      }
    });
  }
  continentSelectionne: string = "All";
  contactFirstName: string = '';
  contactLastName: string = '';
  contactEmail: any;
  contactPhone: string = '';
  contactCompany: string = '';
  contactSubject: string = '';
  message: any;
  newsletterSubscribed: boolean = false;
  selectedContactIndicatif: string = '+221';
  
  contacter(){
    if (!this.contactFirstName || !this.contactLastName || !this.contactEmail || !this.contactPhone || !this.contactSubject || !this.message) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur de validation',
        text: 'Veuillez remplir tous les champs obligatoires.',
        confirmButtonColor: '#FFDD33'
      });
      return;
    }
    
    const mess = {
      name: `${this.contactFirstName} ${this.contactLastName}`.trim(),
      email: this.contactEmail,
      phone: this.selectedContactIndicatif + this.contactPhone,
      company: this.contactCompany || '',
      subject: this.contactSubject,
      message: this.message,
      newsletter: this.newsletterSubscribed
    };
    this.contactService.contact(mess).subscribe((response:any)=>{
      // Réponse reçue silencieusement
      this.showMessage('success', 'Félicitations', `${response.message}`);
      // Réinitialiser le formulaire
      this.contactFirstName = '';
      this.contactLastName = '';
      this.contactEmail = '';
      this.contactPhone = '';
      this.contactCompany = '';
      this.contactSubject = '';
      this.message = '';
      this.newsletterSubscribed = false;
      this.selectedContactIndicatif = '+221';
    },
    (error: any) => {
      // Gestion des erreurs lors de l'inscription
      // Erreur silencieuse de contact
  
      if (error.status === 400) {
        this.showMessage('error', 'Erreur de validation', 'Veuillez vérifier les informations saisies.');
      } else if (error.status === 500) {
        this.showMessage('error', 'Erreur serveur', 'Une erreur est survenue, veuillez réessayer plus tard.');
      }else if (error.status === 422) {
        const validationErrors = error.error;
        let errorMessage = "Erreur de validation :\n";
        for (const [field, messages] of Object.entries(validationErrors)) {
          errorMessage += `${field}: ${(messages as string[]).join(', ')}\n`;
        }
        this.showMessage('error', 'Erreur de validation', errorMessage);
      }
       else {
        this.showMessage('error', 'Erreur', 'Une erreur inattendue est survenue.');
      }
    })
  }

  
  filterEsims(): void {
    // First apply text search
    if (this.searchText) {
      this.filteredEsims = this.pays.filter((pays: any) => {
        const searchLower = this.searchText.toLowerCase();
        return pays.nom && pays.nom.toLowerCase().includes(searchLower);
      });
    } else {
      this.filteredEsims = this.pays;
    }
  }
  
  filtrerPays(continent: string) {
    this.continentSelectionne = continent;
    this.selectedContinent = continent;
    
    // Reset search text when changing continent filter
    // Uncomment if you want this behavior
    // this.searchText = '';
    
    // Re-apply filters
    this.applyAllFilters();
  }
  
  applyAllFilters() {
    // First reset to all pays
    let result = this.pays;
    
    // Apply text filter if present
    if (this.searchText) {
      result = result.filter((pays: any) => {
        const searchLower = this.searchText.toLowerCase();
        return pays.nom && pays.nom.toLowerCase().includes(searchLower);
      });
    }
    
    // Then apply continent filter if not "All"
    if (this.continentSelectionne !== "All") {
      result = result.filter(p => p.continent === this.continentSelectionne);
    }
    
    this.filteredEsims = result;
  }
  
  getPaysFiltres() {
    return this.filteredEsims;
  }
  
   showMessage(icon:any, titre:any, texte:any){
      Swal.fire({
        icon: icon,
        title: titre,
        text: texte,
        confirmButtonColor: `var(--couleur)`,
        showConfirmButton: false,
        timer:2000,
      })
    }  







    // pour le modale 
    
    closeModal() {
      this.showModal = false;
    }
    goToEsimPage() {
      window.location.href = 'https://wawtelecom.com/travel'; // lien vers ta page eSIM
    }
}
