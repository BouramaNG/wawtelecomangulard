import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EsimService } from '../../services/esim.service';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offre',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxPaginationModule, FormsModule],
  templateUrl: './offre.component.html',
  styleUrl: './offre.component.css'
})
export class OffreComponent  implements OnInit{
desarchiver(arg0: any) {
}
filteredEsims: any[] = [];
 
  // Variables pour la recherche
  searchText: string = '';
  filterAssigned: string = 'all';
  Esims:any;
  EsimsPack:any;
  page: number = 1;  // Numéro de la page actuelle
  itemsPerPage: number = 6;
  lpa: any;
  sm_dp_address: any;
  code: any;
  package_id: any;
  c_code: any;
  plan: any;
  packageChoisi: any;
  constructor(private esimService:EsimService){}
  ngOnInit(): void {
    
    this.getEsim();
    this.getEsimPack();
    
  }
  getEsimPack(){
    this.esimService.listEsimPackage().subscribe((response:any)=>{
      console.log(response);
      this.EsimsPack=response;
    })
  }

  getEsim(){
    this.esimService.listEsim().subscribe((response:any)=>{
      console.log(response);
      this.Esims=response;
      console.log(this.Esims)
      this.filteredEsims=this.Esims;
    })
  }

  addEsim(){
    const eSim={
      esim_package_id:this.package_id,
      activation_code: this.code,
      sm_dp_address:this.sm_dp_address,
      country_code: this.c_code,
      plan_name: this.plan,
      lpa:this.lpa,
      is_assigned: false,
    }
    this.esimService.addEsim(eSim).subscribe((response:any)=>{
      console.log(response);
      this.showMessage('success', 'Félicitations', `${response.message}`);
      this.resetFields();
    })
  }
  esimChoisi:any;
  charger(esim:any){
    this.esimChoisi=esim;
    this.code=esim.activation_code,
    this.sm_dp_address=esim.sm_dp_address,
    this.lpa =esim.lpa,
    this.package_id=esim.esim_package_id,
    this.packageChoisi=this.EsimsPack.find((elt:any)=>elt.id==this.package_id);
    console.log(this.packageChoisi);

    this.c_code=this.packageChoisi.country_code,
    this.plan=this.packageChoisi.plan_name
    
  }
  filterEsims(): void {
    // Start with all eSIMs
    this.filteredEsims = this.Esims;
    
    // Step 1: Filter by special status terms if present
    if (this.searchText.toLowerCase() === 'assigne') {
      this.filteredEsims = this.filteredEsims.filter((elt: any) => elt.is_assigned == 1);
      this.page = 1;  // Reset pagination
      return;  // Exit early since we've applied a special filter
    } else if (this.searchText.toLowerCase() === 'non assigne') {
      this.filteredEsims = this.filteredEsims.filter((elt: any) => elt.is_assigned == 0);
      this.page = 1;  // Reset pagination
      return;  // Exit early since we've applied a special filter
    }
    
    // Step 2: For other search terms, filter by text matching
    if (this.searchText) {
      this.filteredEsims = this.filteredEsims.filter((esim: any) => {
        const searchLower = this.searchText.toLowerCase();
        
        // Check activation code and lpa for matches
        return (esim.activation_code && esim.activation_code.toLowerCase().includes(searchLower)) ||
               (esim.lpa && esim.lpa.toLowerCase().includes(searchLower));
      });
    }
    
    // Reset pagination
    this.page = 1;
  }
  modifierEsim(){
    const eSim={
      esim_package_id:this.package_id,
      activation_code: this.code,
      sm_dp_address:this.sm_dp_address,
      country_code: this.c_code,
      plan_name: this.plan,
      lpa:this.lpa,
      is_assigned: false,
    }
    this.esimService.updateEsim(this.esimChoisi.id, eSim).subscribe((response:any)=>{
      console.log(response);
      this.showMessage('success', 'Félicitations', `${response.message}`);
      this.Esims;
      this.resetFields();
    })
  }
  archiver(esimId:any){
    this.esimService.archiverEsim(esimId).subscribe((response:any)=>{
      console.log(response);
      this.showMessage('success', 'Félicitations', `${response.message}`);
      this.Esims;
    })
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
      resetFields() {
        this.package_id = null;
        this.code = '';
        this.sm_dp_address = '';
        this.c_code = '';
        this.plan = '';
        this.lpa = '';
        
      }
      
}
