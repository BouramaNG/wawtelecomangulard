import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { EsimService } from '../../services/esim.service';

@Component({
  selector: 'app-stat',
  standalone: true,
  imports: [],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.css'
})
export class StatComponent implements OnInit {
  commandes: any = [];
  esims: any[] = [];
  esimChoisi: any[] = [];
  constructor(private orderService:OrderService, private esimService:EsimService){}
  ngOnInit(): void {
    this.getPaie();
    this.getEsims();
  }
  getPaie(){
    this.orderService.listePaiement().subscribe((response:any)=>{
      console.log(response);
      // Gérer différents formats de réponse
      if (response && Array.isArray(response.payments)) {
        this.commandes = response.payments;
      } else if (response && Array.isArray(response)) {
        this.commandes = response;
      } else if (response && Array.isArray(response.data)) {
        this.commandes = response.data;
      } else {
        this.commandes = [];
      }
      console.log('Commandes:', this.commandes);
      
      if (Array.isArray(this.commandes) && this.commandes.length > 0) {
        this.totalPayments = this.commandes.reduce((total:any, payment:any) => {
          const amount = parseFloat(payment.amount) || 0;
          return total + amount;
        }, 0);
      } else {
        this.totalPayments = 0;
      }
    }, (error) => {
      console.error('Erreur lors du chargement des paiements:', error);
      this.commandes = [];
      this.totalPayments = 0;
    });
  }
  
  getEsims() {
    this.esimService.listEsim().subscribe((response: any) => {
      this.esims = response;
      this.esimChoisi = this.esims.filter((element: any) => element.is_assigned == 0);
      console.log(this.esimChoisi);
    }, (error) => {
      console.error('Erreur lors du chargement des eSIMs:', error);
    });
  }
  totalPayments = 0;



 



}