import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../shared/api_url';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EsimService {

  constructor(private http:HttpClient) { }
  addEsimPackage(esim:any){
    const token=localStorage.getItem('token')
   return this.http.post(`${url}esim-packages`,esim, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}` 
    })
  })
  }
  updateEsimPackage(esim_package_id:any, updatedPack:any){
    return this.http.put(`${url}esim-packages/${esim_package_id}`,esim_package_id,updatedPack)
  }
  archivePack(esim_package_id:any){
    return this.http.delete(`${url}esim-packages/${esim_package_id}`, esim_package_id)
  }
  
  listEsimPackage(): Observable<any> {
    return this.http.get<any>(`${url}esim-packages`)
  }
  listEsim(){
   const token = localStorage.getItem('token');
   return this.http.get<any>(`${url}admin/esims`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}` 
    })
  })
  }
  addEsim(esim:any){
    return this.http.post(`${url}esims/add`, esim);
  }
  updateEsim(esimId:any, esimInfo:any){
    return this.http.put(`${url}esims/${esimId}`, esimId, esimInfo)
  }
  archiverEsim(esimId:any){
    return this.http.delete(`${url}esims/${esimId}`,esimId)
  }
  listEsimPackageTemplates(): Observable<any> {
    return this.http.get<any>(`${url}admin/package-templates`);
  }
  updateEsimPackageTemplate(id: number, data: any) {
    return this.http.put(`${url}admin/package-templates/${id}`, data);
  }
  toggleStatusEsimPackageTemplate(id: number) {
    return this.http.patch(`${url}admin/package-templates/${id}/status`, {});
  }
  getEsimStockStats(): Observable<any> {
    return this.http.get<any>(`${url}admin/esims/stock-stats`);
  }
  
  // Méthode pour récupérer les destinations disponibles
  getAvailableDestinations(): Observable<any> {
    return this.http.get<any>(`${url}esim-purchase/destinations`);
  }
  getEsimPackagesWithPrice(countryCode: string): Observable<any> {
    console.log('[EsimService] Appel de getEsimPackagesWithPrice avec countryCode:', countryCode);
    
    if (!countryCode) {
      console.error('[EsimService] Erreur: Aucun code pays fourni');
      return of({ success: false, message: 'Code pays manquant' });
    }
    
    return new Observable(observer => {
      const apiUrl = `${url}esim-packages/${countryCode}/with-price`;
      console.log(`[EsimService] Envoi de la requête à ${apiUrl}`);
      
      this.http.get<any>(apiUrl).subscribe({
        next: (response) => {
          console.log('[EsimService] Réponse reçue:', response);
          
          if (!response) {
            console.error('[EsimService] Réponse vide du serveur');
            observer.error('Réserve vide du serveur');
            return;
          }
          
          if (!response.success) {
            console.error('[EsimService] Erreur dans la réponse:', response.message || 'Erreur inconnue');
          } else {
            console.log(`[EsimService] ${response.packages?.length || 0} forfaits reçus`);
          }
          
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          console.error('[EsimService] Erreur lors de la récupération des forfaits:', error);
          console.error('Détails de l\'erreur:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            url: error.url
          });
          observer.error(error);
        }
      });
    });
  }
}
