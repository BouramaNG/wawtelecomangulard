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
  commandes:any;
  esims: any;
  esimChoisi: any[]=[];
  constructor(private orderService:OrderService, private esimService:EsimService){}
  ngOnInit(): void {
    this.getPaie();
    this.getEsims();
  }
  getPaie(){
    this.orderService.listePaiement().subscribe((response:any)=>{
      console.log(response);
      this.commandes=response.payments;
      console.log(this.commandes)
      this.totalPayments = this.commandes.reduce((total:any, payment:any) => total + parseFloat(payment.amount), 0);
      // console.log('montant totel ',this.totalPayments)
    }, (error) => {
      console.error('Erreur lors du chargement des paiements:', error);
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