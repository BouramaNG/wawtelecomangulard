import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EsimService } from '../../services/esim.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-esim',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-esim.component.html',
  styleUrl: './admin-esim.component.css'
})
export class AdminEsimComponent implements OnInit {
  code: any;
  name: any;
  plan: any;
  prix: any;
  duree: any;
  net: any;
  lpa: any;
  esim_ident: any;
  image: any;
  net_inf: any;
  expolicy: any;
  hotspot: any;
  speed: any;
  selectedFiles: any;
  idEsim:any;
  esims:any;
  esimChoisi: any;
  idPackage: any;
  esim_package: any;
  esimPackageChoisi: any;
  constructor(private esimService:EsimService, private route:ActivatedRoute){}
 

  ngOnInit(): void {
    this.idEsim=this.route.snapshot.params['id'];
    this.getEsims();
    this.listerPack();
  }

  getEsims(){
    this.esimService.listEsim().subscribe((response:any)=>{
    console.log(response);
    this.esims=response;
    console.log(this.esims, 'Esim');
    this.esimChoisi=this.esims.find((elt:any)=>elt.id ==this.idEsim);
    console.log(this.esimChoisi, 'Esim choisi')
    this.idPackage= this.esimChoisi.esim_package_id;
    console.log(this.idPackage)
    })
  }

  listerPack(){
    this.esimService.listEsimPackage().subscribe((response:any)=>{
        console.log(response, 'reponse liste pack');
        this.esim_package=response;
        this.esimPackageChoisi=this.esim_package.find((elt:any)=>elt.id==this.idPackage);
        console.log(this.esimPackageChoisi)
    })
  }
  charger(){
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
    this.esimService.updateEsimPackage(this.esimChoisi.id, updatedPack).subscribe(
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
  
  
  archiverPack(){
    this.esimService.archivePack(this.esimPackageChoisi.id).subscribe((response:any)=>{
      console.log(response);
      this.showMessage('success', 'Félicitations', `${response.message}`);
    })
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

}
