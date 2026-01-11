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
  itemsPerPage: number = 12;
  viewMode: 'grid' | 'table' = 'grid'; // Mode d'affichage: grille ou tableau

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
    try {
      // userInfo est stocké avec JSON.stringify(userChiffrees) dans login.component.ts
      const userInfoStored = localStorage.getItem('userInfo');
      if (userInfoStored) {
        try {
          // Essayer de parser si c'est une string JSON
          let userInfoEncrypted = userInfoStored;
          try {
            userInfoEncrypted = JSON.parse(userInfoStored);
          } catch (e) {
            // Si ce n'est pas du JSON, utiliser directement
          }
          
          this.user = this.encryptionService.decryptData(userInfoEncrypted);
          console.log('Utilisateur déchiffré:', this.user);
        } catch (e) {
          console.warn('Erreur lors du déchiffrement userInfo:', e);
        }
      }
    } catch (e) {
      console.error('Erreur dans ngOnInit compte:', e);
    }
    this.getEsimPackageTemplates();
  }

  getEsimPackageTemplates(){
    // Utiliser listEsimPackageTemplates pour obtenir les templates (438) au lieu des packages réels (15)
    // C'est ce qui correspond aux "Packages actifs: 438" du dashboard
    console.log('🔵 [COMPTE] Chargement des templates de packages depuis /admin/package-templates/local');
    this.esimService.listEsimPackageTemplates({ per_page: 500 }).subscribe((response:any)=>{
      console.log('🟢 [COMPTE] Réponse templates:', response);
      // Gérer différents formats de réponse
      if (response && response.templates && Array.isArray(response.templates)) {
        this.EsimsPack = response.templates;
      } else if (response && response.packages && Array.isArray(response.packages)) {
        this.EsimsPack = response.packages;
      } else if (response && Array.isArray(response)) {
        this.EsimsPack = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        this.EsimsPack = response.data;
      } else {
        this.EsimsPack = [];
      }
      this.filteredEsims = this.EsimsPack || [];
      console.log('🟢 [COMPTE] Templates chargés:', this.EsimsPack.length);
    }, (error) => {
      console.error('🔴 [COMPTE] Erreur lors du chargement des templates:', error);
      this.EsimsPack = [];
      this.filteredEsims = [];
    });
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
      // S'assurer que EsimsPack est un tableau
      if (!Array.isArray(this.EsimsPack)) {
        this.EsimsPack = [];
      }
      
      if (!this.searchText || this.searchText.trim() === '') {
        this.filteredEsims = this.EsimsPack || [];
      } else {
        if (Array.isArray(this.EsimsPack)) {
          const searchLower = this.searchText.toLowerCase().trim();
          this.filteredEsims = this.EsimsPack.filter((pkg: any) => {
            // Chercher dans tous les champs pertinents
            const nameMatch = (pkg.name && pkg.name.toLowerCase().includes(searchLower)) ||
                            (pkg.plan_name && pkg.plan_name.toLowerCase().includes(searchLower));
            const countryMatch = (pkg.country && pkg.country.toLowerCase().includes(searchLower)) ||
                               (pkg.country_name && pkg.country_name.toLowerCase().includes(searchLower)) ||
                               (pkg.country_code && pkg.country_code.toLowerCase().includes(searchLower));
            const dataMatch = pkg.data_mb && pkg.data_mb.toString().includes(searchLower);
            const telnaMatch = pkg.telna_id && pkg.telna_id.toString().toLowerCase().includes(searchLower);
            const statusMatch = pkg.status && this.getStatusLabel(pkg.status).toLowerCase().includes(searchLower);
            
            return nameMatch || countryMatch || dataMatch || telnaMatch || statusMatch;
          });
        } else {
          this.filteredEsims = [];
        }
      }
    }

    /**
     * Obtenir le label du statut avec la bonne casse
     */
    getStatusLabel(status: string): string {
      if (!status) return 'Non défini';
      const statusLower = status.toLowerCase().trim();
      
      if (statusLower === 'active' || statusLower === 'actif') {
        return 'Active';
      } else if (statusLower === 'inactive' || statusLower === 'inactif') {
        return 'Inactive';
      } else if (statusLower === 'de-activated' || statusLower === 'deactivated') {
        return 'De-activated';
      } else if (statusLower === 'not activated' || statusLower === 'notactivated') {
        return 'Not Activated';
      }
      
      // Retourner le statut tel quel s'il n'est pas reconnu
      return status;
    }

    /**
     * Vérifier si le statut est actif
     */
    isStatusActive(status: string): boolean {
      if (!status) return false;
      const statusLower = status.toLowerCase().trim();
      return statusLower === 'active' || statusLower === 'actif';
    }

    /**
     * Obtenir la classe CSS pour le badge de statut
     */
    getStatusBadgeClass(status: string): string {
      if (!status) return 'badge-status-unknown';
      const statusLower = status.toLowerCase().trim();
      
      if (statusLower === 'active' || statusLower === 'actif') {
        return 'badge-status-active';
      } else if (statusLower === 'inactive' || statusLower === 'inactif') {
        return 'badge-status-inactive';
      } else if (statusLower === 'de-activated' || statusLower === 'deactivated') {
        return 'badge-status-deactivated';
      } else if (statusLower === 'not activated' || statusLower === 'notactivated') {
        return 'badge-status-not-activated';
      }
      
      return 'badge-status-unknown';
    }

    /**
     * Formater les données en GB
     */
    formatData(dataMb: number | null | undefined): string {
      if (!dataMb || dataMb === 0) return '-';
      if (dataMb >= 1024) {
        return `${(dataMb / 1024).toFixed(1)} GB`;
      }
      return `${dataMb} MB`;
    }

    /**
     * Formater la date
     */
    formatDate(dateString: string | null | undefined): string {
      if (!dateString) return '-';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return '-';
      }
    }

    /**
     * Obtenir le nom du pays (utiliser country_name ou country ou convertir depuis country_code)
     */
    getCountryName(pkg: any): string {
      if (pkg.country_name && pkg.country_name.trim() && 
          pkg.country_name !== 'Unknown' && 
          pkg.country_name !== 'UNK' &&
          pkg.country_name.toUpperCase() !== 'UNK') {
        return pkg.country_name;
      }
      if (pkg.country && pkg.country.trim() && 
          pkg.country !== 'Unknown' && 
          pkg.country !== 'UNK' &&
          pkg.country.toUpperCase() !== 'UNK') {
        return pkg.country;
      }
      if (pkg.country_code && pkg.country_code.trim() && pkg.country_code !== 'UNK') {
        return pkg.country_code;
      }
      return '-';
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
