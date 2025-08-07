import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from '../../partials/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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
    }
  ]
  
  page=1;
  items:any;
selectedContinent: any;
  ngOnInit(): void {
    this.filteredEsims = this.pays;
  }
  continentSelectionne: string = "All";

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

}
