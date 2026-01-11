import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../shared/api_url';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http:HttpClient,
    private encryptionService: EncryptionService
  ) { }
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
    const token = this.encryptionService.getDecryptedToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get(`${url}orders`, headers ? { headers } : {})
  }
  listePaiement(){
    const token = this.encryptionService.getDecryptedToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get(`${url}payments`, headers ? { headers } : {})
  }
}
