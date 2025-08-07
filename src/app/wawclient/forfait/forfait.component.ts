import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { EncryptionService } from '../../services/encryption.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-forfait',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, TranslateModule],
  templateUrl: './forfait.component.html',
  styleUrl: './forfait.component.css'
})
export class ForfaitComponent  implements OnInit{
  userConnect: any;
  commandeUser: any;
  paiement: any;
  paiementUser: any[]=[];
  page=1;
  constructor(private orderService:OrderService, private encryptionService: EncryptionService){}
  commandes:any;
  ngOnInit(): void {
    this.getOrder();
    this.getPaie();
    const donneesChiffrees = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (donneesChiffrees) {
      this.userConnect = this.encryptionService.decryptData(donneesChiffrees);
      // console.log('Forfait déchiffré:', this.userConnect);
      return this.userConnect;
    }
    
  
    

  }
  getPaie(){
    this.orderService.listePaiement().subscribe((response:any)=>{
      // console.log(response);
      this.paiement = response.payments
      console.log(this.paiement);
      this.paiementUser = this.paiement.filter((elt:any)=>elt.order.user_id ==this.userConnect.id);
      // console.log(this.paiementUser, 'userPaie')
    })
  }
  getOrder(){
    this.orderService.listOrder().subscribe((response:any)=>{
      // console.log(response);
      this.commandes=response.orders;
      console.log(this.commandes);
      this.commandeUser=this.commandes.filter((elt:any)=>
        elt.user_id==this.userConnect.id
      )
      // console.log(this.commandeUser)
    })
  }

}
