import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../shared/api_url';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class EsimService {

  constructor(
    private http:HttpClient,
    private encryptionService: EncryptionService
  ) { }
  
  addEsimPackage(esim:any){
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of({ error: 'Token non disponible' });
    }
    return this.http.post(`${url}esim-packages`,esim, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }
  updateEsimPackage(esim_package_id:any, updatedPack:any){
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of({ error: 'Token non disponible' });
    }
    return this.http.put(`${url}esim-packages/${esim_package_id}`, updatedPack, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }
  archivePack(esim_package_id:any){
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of({ error: 'Token non disponible' });
    }
    return this.http.delete(`${url}esim-packages/${esim_package_id}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }
  
  listEsimPackage(): Observable<any> {
    // Cette route est publique, pas besoin de token
    return this.http.get<any>(`${url}esim-packages`);
  }

  /**
   * Liste les packages admin (comme waw-admin-dashboard)
   * Endpoint: GET /admin/packages
   */
  listAdminPackages(params?: any): Observable<any> {
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      console.error('Token non disponible pour listAdminPackages');
      return of({ packages: [], pagination: null });
    }
    
    console.log('🔵 [FRONTEND] Token déchiffré pour packages:', token.substring(0, 30) + '...');
    console.log('🔵 [FRONTEND] Longueur du token:', token.length);
    console.log('🔵 [FRONTEND] URL complète:', `${url}admin/packages`);
    console.log('🔵 [FRONTEND] Headers Authorization:', `Bearer ${token.substring(0, 30)}...`);
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    console.log('🔵 [FRONTEND] Headers complets:', {
      Authorization: headers.get('Authorization')?.substring(0, 50) + '...',
      'Content-Type': headers.get('Content-Type'),
      'Accept': headers.get('Accept')
    });
    
    return this.http.get<any>(`${url}admin/packages`, {
      headers: headers,
      params: params || {}
    }).pipe(
      map((response: any) => {
        console.log('🟢 [FRONTEND] Réponse packages reçue:', response);
        // L'API retourne {success: true, packages: [...], pagination: {...}} pour admin
        // ou {success: true, data: [...], pagination: {...}} pour partenaire
        if (response && response.data) {
          return {
            packages: response.data.packages || response.data.data || [],
            pagination: response.data.pagination || null
          };
        }
        return {
          packages: response.packages || response.data || [],
          pagination: response.pagination || null
        };
      }),
      catchError((error) => {
        console.error('🔴 [FRONTEND] Erreur lors de la récupération des packages:', error);
        console.error('🔴 [FRONTEND] Status:', error.status);
        console.error('🔴 [FRONTEND] Status Text:', error.statusText);
        console.error('🔴 [FRONTEND] Error message:', error.error?.message);
        console.error('🔴 [FRONTEND] Error full:', error.error);
        if (error.status === 401) {
          console.error('🔴 [FRONTEND] Token invalide ou expiré. Token utilisé:', token.substring(0, 50));
          console.error('🔴 [FRONTEND] Header Authorization envoyé:', `Bearer ${token.substring(0, 50)}...`);
        }
        return of({ packages: [], pagination: null });
      })
    );
  }
  listEsim(){
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of([]);
    }
    return this.http.get<any>(`${url}admin/esims`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    }).pipe(
      map((response: any) => {
        // Si la réponse est un tableau directement
        if (Array.isArray(response)) {
          return response;
        }
        // Si la réponse est un objet avec success et esims
        if (response.success && Array.isArray(response.esims)) {
          return response.esims;
        }
        // Si la réponse contient juste esims
        if (Array.isArray(response.esims)) {
          return response.esims;
        }
        // Si la réponse contient data
        if (Array.isArray(response.data)) {
          return response.data;
        }
        // Fallback: retourner un tableau vide
        return [];
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération des eSIMs:', error);
        return of([]);
      })
    );
  }
  addEsim(esim:any){
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of({ error: 'Token non disponible' });
    }
    return this.http.post(`${url}esims/add`, esim, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }
  updateEsim(esimId:any, esimInfo:any){
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of({ error: 'Token non disponible' });
    }
    return this.http.put(`${url}esims/${esimId}`, esimInfo, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }
  archiverEsim(esimId:any){
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of({ error: 'Token non disponible' });
    }
    return this.http.delete(`${url}esims/${esimId}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }
  /**
   * Récupérer les templates de packages depuis la base locale
   * Utilise /admin/package-templates/local comme waw-admin-dashboard
   * Retourne les 438 templates au lieu des 15 packages réels activés
   */
  listEsimPackageTemplates(params?: any): Observable<any> {
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      console.error('🔴 [FRONTEND] Token non disponible pour listEsimPackageTemplates');
      return of({ templates: [], packages: [] });
    }

    console.log('🔵 [FRONTEND] Récupération des templates depuis /admin/package-templates/local');
    
    // Construire les paramètres de requête
    const queryParams: any = {};
    if (params) {
      if (params.per_page) queryParams.per_page = params.per_page;
      if (params.page) queryParams.page = params.page;
      if (params.search) queryParams.search = params.search;
      if (params.country_code) queryParams.country_code = params.country_code;
      if (params.status) queryParams.status = params.status;
      if (params.sort_by) queryParams.sort_by = params.sort_by;
      if (params.sort_order) queryParams.sort_order = params.sort_order;
    }
    
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${url}admin/package-templates/local${queryString ? '?' + queryString : ''}`;
    
    console.log('🔵 [FRONTEND] URL complète templates:', fullUrl);

    return this.http.get<any>(fullUrl, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      map((response: any) => {
        console.log('🟢 [FRONTEND] Réponse templates complète:', response);
        
        // Format de réponse backend: {success: true, templates: [...], pagination: {...}}
        if (response && response.success !== false && Array.isArray(response.templates)) {
          console.log('🟢 [FRONTEND] Templates trouvés:', response.templates.length);
          // Convertir 'templates' en 'packages' pour compatibilité avec le frontend
          return {
            success: true,
            packages: response.templates,
            templates: response.templates,
            pagination: response.pagination || {}
          };
        }
        // Si la réponse contient juste templates (sans success)
        if (Array.isArray(response.templates)) {
          console.log('🟢 [FRONTEND] Templates trouvés (format alternatif):', response.templates.length);
          return {
            packages: response.templates,
            templates: response.templates,
            pagination: response.pagination || {}
          };
        }
        // Si la réponse est un tableau directement
        if (Array.isArray(response)) {
          console.log('🟢 [FRONTEND] Templates trouvés (tableau direct):', response.length);
          return {
            packages: response,
            templates: response
          };
        }
        // Fallback
        console.warn('🟡 [FRONTEND] Format de réponse inattendu pour templates:', response);
        return { packages: [], templates: [] };
      }),
      catchError((error) => {
        console.error('🔴 [FRONTEND] Erreur lors de la récupération des templates:', error);
        console.error('🔴 [FRONTEND] Status:', error.status);
        console.error('🔴 [FRONTEND] Status Text:', error.statusText);
        console.error('🔴 [FRONTEND] Error message:', error.error?.message);
        return of({ packages: [], templates: [] });
      })
    );
  }
  updateEsimPackageTemplate(id: number, data: any) {
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of({ error: 'Token non disponible' });
    }
    return this.http.put(`${url}admin/package-templates/${id}`, data, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }
  toggleStatusEsimPackageTemplate(id: number) {
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of({ error: 'Token non disponible' });
    }
    return this.http.patch(`${url}admin/package-templates/${id}/status`, {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }
  getEsimStockStats(): Observable<any> {
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of({ error: 'Token non disponible' });
    }
    return this.http.get<any>(`${url}admin/esims/stock-stats`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }
  
  // Méthode pour récupérer les destinations disponibles
  getAvailableDestinations(): Observable<any> {
    return this.http.get<any>(`${url}esim-purchase/destinations`);
  }
  getEsimPackagesWithPrice(countryCode: string): Observable<any> {
    if (!countryCode) {
      return of({ success: false, message: 'Code pays manquant' });
    }
    
    return new Observable(observer => {
      const apiUrl = `${url}esim-packages/${countryCode}/with-price`;
      
      this.http.get<any>(apiUrl).subscribe({
        next: (response) => {
          if (!response) {
            observer.error('Réponse vide du serveur');
            return;
          }
          
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}
