import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EsimService } from '../../services/esim.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { StatComponent } from "../../partials/stat/stat.component";
import { EncryptionService } from '../../services/encryption.service';

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxPaginationModule, StatComponent],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.css'
})
export class CompteComponent implements OnInit {
  EsimsPack: any[]=[];
itemsPerPage: number = 6;

  filteredEsims: any[]=[];
  searchText: any;
  page: number=1;
  Esims: any;
  esimPackageChoisi: any;

  constructor(private esimService:EsimService, private encryptionService: EncryptionService){}
  user:any;
  selectedFiles: any;
  speed: any;
  hotspot: any;
  expolicy: any;
  net_inf: any;
  image: any;
  esim_ident: any;
  lpa: any;
  net: any;
  duree: any;
  prix: any;
  plan: any;
  name: any;
  code: any;
  // Pour l'édition
  packageEdit: any = null;
  showEditModal: boolean = false;

  ngOnInit(): void {
    const donneesChiffrees =JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (donneesChiffrees) {
      this.user = this.encryptionService.decryptData(donneesChiffrees);
      console.log('Forfait déchiffré:', this.user);
    }
    console.log(this.user);
    this.getEsimPackageTemplates();
  }

  getEsimPackageTemplates(){
    this.esimService.listEsimPackageTemplates().subscribe((response:any)=>{
      console.log(response);
      this.EsimsPack=response.packages;
      this.filteredEsims=this.EsimsPack;
    })
  }


   addPack() {
      const pack = {
        country_code: this.code,
        country_name: this.name,
        plan_name: this.plan,
        price: this.prix,
        validity_days: Number(this.duree),
        network_provider: this.net,
        lpa: this.lpa,
        esim_identifier: this.esim_ident,
        image: this.image,
        network_info: this.net_inf,
        expiration_policy: this.expolicy,
        hotspot_allowed: this.hotspot,
        speed_limit: this.speed, 
      };
    
      this.esimService.addEsimPackage(pack).subscribe(
        (response: any) => {
          console.log(response);
          this.showMessage('success', 'Félicitations', `${response.message}`);
        },
        (error: any) => {
          console.error(error);
          if (error.status === 422) {
            // Erreurs de validation
            const validationErrors = Object.values(error.error.details).flat().join('\n');
            this.showMessage('error', 'Erreur de validation', validationErrors);
          } else if (error.status === 500) {
            // Erreur serveur
            this.showMessage('error', 'Erreur serveur', "Une erreur s'est produite lors de l'ajout du forfait.");
          } else {
            // Autres erreurs
            this.showMessage('error', 'Erreur', "Échec de l'ajout du forfait eSIM.");
          }
        }
      );
    }
    

    filterEsims(): void {
      this.filteredEsims = this.EsimsPack;
      
      // Filter by text matching
      if (this.searchText) {
        this.filteredEsims = this.EsimsPack.filter((esim: any) => {
          const searchLower = this.searchText.toLowerCase();
          
          // Check various properties for matches
          return (esim.country_name && esim.country_name.toLowerCase().includes(searchLower)) ||
                 (esim.plan_name && esim.plan_name.toLowerCase().includes(searchLower)) ||
                 (esim.price && esim.price.toString().toLowerCase().includes(searchLower)) ||
                 (esim.validity_days && esim.validity_days.toString().toLowerCase().includes(searchLower));
        });
      }
    }

  
    getFiles(event: any) {
      this.selectedFiles  = Array.from(event.target.files); // Convertir en tableau
      console.log(this.selectedFiles)
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
    archiverPack(esimPackId:any){
      this.esimService.archivePack(esimPackId).subscribe((response:any)=>{
        console.log(response);
        this.showMessage('success', 'Félicitations', `${response.message}`);
      })
    }

    charger(esim:any){
      this.esimPackageChoisi =esim
      this.code=this.esimPackageChoisi.country_code,
        this.name=this.esimPackageChoisi.country_name,
        this.plan=this.esimPackageChoisi.plan_name,
        this.prix=this.esimPackageChoisi.price,
        this.duree=this.esimPackageChoisi.validity_days,
        this.net=this.esimPackageChoisi.network_provider,
        this.image=this.esimPackageChoisi.image,
        this.net_inf=this.esimPackageChoisi.network_info,
        this.expolicy=this.esimPackageChoisi.expiration_policy,
        this.hotspot=this.esimPackageChoisi.hotspot_allowed,
        this.speed= this.esimPackageChoisi.speed_limit
    }

    updatePack() {
      const updatedPack = {
        country_code: this.code,
        country_name: this.name,
        plan_name: this.plan,
        price: this.prix,
        validity_days: Number(this.duree),
        network_provider: this.net,
        image: this.image,
        network_info: this.net_inf,
        expiration_policy: this.expolicy,
        hotspot_allowed: this.hotspot,
        speed_limit: this.speed,
      };
    
      // Appel de la méthode updateEsimPackage dans le service
      this.esimService.updateEsimPackage(this.esimPackageChoisi.id, updatedPack).subscribe(
        (response: any) => {
          console.log(response);
          this.showMessage('success', 'Félicitations', `${response.message}`);
        },
        (error: any) => {
          console.error(error);
          if (error.status === 422) {
            // Erreurs de validation
            const validationErrors = Object.values(error.error.details).flat().join('\n');
            this.showMessage('error', 'Erreur de validation', validationErrors);
          } else if (error.status === 500) {
            // Erreur serveur
            this.showMessage('error', 'Erreur serveur', "Une erreur s'est produite lors de la mise à jour du forfait.");
          } else {
            // Autres erreurs
            this.showMessage('error', 'Erreur', "Échec de la mise à jour du forfait eSIM.");
          }
        }
      );
    }

    openEditModal(pkg: any) {
      this.packageEdit = { ...pkg };
      this.showEditModal = true;
    }
    closeEditModal() {
      this.showEditModal = false;
      this.packageEdit = null;
    }
    submitEdit() {
      if (!this.packageEdit) return;
      this.esimService.updateEsimPackageTemplate(this.packageEdit.id, this.packageEdit).subscribe(
        (res: any) => {
          this.showMessage('success', 'Succès', res.message);
          this.closeEditModal();
          this.getEsimPackageTemplates();
        },
        (err: any) => {
          this.showMessage('error', 'Erreur', "Échec de la modification du package.");
        }
      );
    }

    toggleStatus(pkg: any) {
      this.esimService.toggleStatusEsimPackageTemplate(pkg.id).subscribe(
        (res: any) => {
          this.showMessage('success', 'Succès', res.message);
          this.getEsimPackageTemplates();
        },
        (err: any) => {
          this.showMessage('error', 'Erreur', "Impossible de changer le statut.");
        }
      );
    }
}
