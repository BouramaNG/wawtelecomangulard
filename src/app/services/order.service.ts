import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../shared/api_url';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor( private http:HttpClient) { }
  commande(com:any){
    console.log('[FRONT][OrderService] Appel POST /orders', com);
    return this.http.post(`${url}orders`,com)
      .pipe(tap({
        next: (res) => console.log('[FRONT][OrderService] Réponse /orders', res),
        error: (err) => console.error('[FRONT][OrderService] Erreur /orders', err)
      }));
  }
  payer(orderId:any){
    console.log('[FRONT][OrderService] Appel POST /payments/initiate', orderId);
    return this.http.post(`${url}payments/initiate`,{order_id: orderId})
      .pipe(tap({
        next: (res) => console.log('[FRONT][OrderService] Réponse /payments/initiate', res),
        error: (err) => console.error('[FRONT][OrderService] Erreur /payments/initiate', err)
      }));
  }
  initiatePayment(orderId: number) {
      console.log('[FRONT][OrderService] Appel POST /payments/initiate', orderId);
      const payload = { order_id: orderId };
      console.log('[FRONT][OrderService] Payload envoyé:', payload);
      return this.http.post(`${url}payments/initiate`, payload).pipe(
          tap(response => {
              console.log('[FRONT][OrderService] Réponse /payments/initiate', response);
          }),
          catchError(error => {
              console.error('[FRONT][OrderService] Erreur /payments/initiate', error);
              console.error('[FRONT][OrderService] Détails erreur:', error.error);
              throw error;
          })
      );
  }
  listOrder(){
    return this.http.get(`${url}orders`)

  }
  listePaiement(){
    return this.http.get(`${url}payments`)
  }
}
