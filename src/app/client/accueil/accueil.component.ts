import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../partials/header/header.component";
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ContactService } from '../../services/contact.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [HeaderComponent, RouterLink, NgxPaginationModule, CommonModule, TranslateModule, FormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit{
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
    }
  ]
  
  page=1;
  items:any;
selectedContinent: any;
showModal = false;
constructor(private contactService:ContactService){}
  ngOnInit(): void {
    this.filteredEsims = this.pays;

    setTimeout(() => {
      this.showModal = true;
    }, 1000); // 3 secondes après le chargement

  }
  continentSelectionne: string = "All";
  name: any;
  email: any;
  message: any;
  contacter(){
    const mess={
      name:this.name,
      email:this.email,
      message:this.message
    }
    this.contactService.contact(mess).subscribe((response:any)=>{
      console.log(response)
      this.showMessage('success', 'Félicitations', `${response.message}`);
    },
    (error: any) => {
      // Gestion des erreurs lors de l'inscription
      console.error('Erreur de contact :', error);
  
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
