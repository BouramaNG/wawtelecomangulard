import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from '../../partials/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DestinationsService } from '../../services/destinations.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [HeaderComponent, NgxPaginationModule, CommonModule, RouterLink, FormsModule,TranslateModule],
  templateUrl: './boutique.component.html',
  styleUrl: './boutique.component.css'
})
export class BoutiqueComponent implements OnInit {
  searchText: any;
  filteredEsims: any[]=[];

  pays=[
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
      "nom": "Arabie Saoudite",
      "drapeau": "https://flagcdn.com/w320/sa.png",
      "continent": "Asie",
      "country_code":"SA"
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
      "nom": "Japon",
      "drapeau": "https://flagcdn.com/w320/jp.png",
      "continent": "Asie",
      "country_code":"JP"
    }
  ]
  
  page=1;
  items:any;
  selectedContinent: any;
  
  // Destinations populaires pour le hero
  popularDestinations: any[] = [];

  continentSelectionne: string = "All";

  constructor(private destinationsService: DestinationsService) {}

  ngOnInit(): void {
    this.filteredEsims = this.pays;
    this.loadDestinationsFromAPI();
    this.updatePopularDestinations();
  }

  updatePopularDestinations() {
    // Sélectionner les destinations les plus populaires
    this.popularDestinations = [
      this.pays.find(p => p.country_code === 'FR') || this.pays[1],
      this.pays.find(p => p.country_code === 'US') || this.pays[3],
      this.pays.find(p => p.country_code === 'MA') || this.pays[2],
      this.pays.find(p => p.country_code === 'ES') || this.pays[4],
    ].filter(Boolean).slice(0, 4);
  }

  loadDestinationsFromAPI() {
    this.destinationsService.getDestinations().pipe(
      catchError(error => {
        console.error('❌ Erreur chargement destinations API:', error);
        return of({ success: false, destinations: [] });
      })
    ).subscribe((response: any) => {
      console.log('🔄 BoutiqueComponent: Réponse API reçue', response);
      
      if (response && response.success && response.destinations && response.destinations.length > 0) {
        console.log('✅ BoutiqueComponent: Destinations API trouvées:', response.destinations.length);
        
        // Créer un map des codes pays statiques pour recherche rapide
        const staticMap = new Map(this.pays.map((p: any) => [p.country_code, p]));
        const newDestinations: any[] = [];
        
        // Traiter chaque destination de l'API
        response.destinations.forEach((dest: any, index: number) => {
          console.log('🔄 BoutiqueComponent: Traitement destination API:', dest.country_code, dest.country_name);
          
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
            console.log('✅ BoutiqueComponent: Destination statique mise à jour:', dest.country_code, existingDest.packages.length, 'packages');
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
            console.log('✅ BoutiqueComponent: Nouvelle destination API ajoutée:', dest.country_code, newDest.packages.length, 'packages');
          }
        });
        
        // Ajouter les nouvelles destinations AU DÉBUT du tableau pour qu'elles soient visibles
        if (newDestinations.length > 0) {
          this.pays = [...newDestinations, ...this.pays];
          console.log('✅ BoutiqueComponent: Nouvelles destinations ajoutées au début:', newDestinations.length);
        }
        
        // Mettre à jour filteredEsims
        this.filteredEsims = this.pays;
        this.updatePopularDestinations();
        console.log('✅ BoutiqueComponent: Destinations finales (statiques + API):', this.pays.length);
      } else {
        console.log('⚠️ BoutiqueComponent: Aucune destination API trouvée ou réponse invalide');
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
      'KE': 'Afrique',
      'BR': 'Amerique du Sud',
      'SA': 'Asie',
      'JP': 'Asie'
    };
    return continentMap[countryCode] || 'Asie';
  }

  scrollToDestinations() {
    const element = document.querySelector('.countries-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  getCountryImage(countryCode: string): string {
    // Utiliser des images de pays depuis Unsplash ou une API similaire
    // Pour l'instant, on utilise une image par défaut avec le code pays
    const countryImages: { [key: string]: string } = {
      'FR': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      'US': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      'MA': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800',
      'ES': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
      'IT': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800',
      'GB': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
      'SA': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
      'TR': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
      'CN': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
      'ZA': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',
      'CI': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
      'CA': 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800',
      'KE': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
      'JP': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
      'PC': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
    };
    
    return countryImages[countryCode] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';
  }

  resetFilters() {
    this.searchText = '';
    this.selectedContinent = 'All';
    this.continentSelectionne = 'All';
    this.filteredEsims = this.pays;
    this.page = 1;
  }

  formatFCFA(amount: number): string {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  }

}
