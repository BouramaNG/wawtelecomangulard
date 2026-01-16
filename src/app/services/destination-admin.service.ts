import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { url } from '../shared/api_url';
import { EncryptionService } from './encryption.service';

export interface SelectedTemplate {
  template_id: number;
  price: number;
}

export interface CreateDestinationRequest {
  country_code: string;
  country_name: string;
  network_provider?: string;
  selected_templates: SelectedTemplate[];
}

@Injectable({
  providedIn: 'root'
})
export class DestinationAdminService {
  private apiUrl = `${url}admin/destinations`;

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) { }

  private getAuthHeaders(): HttpHeaders | null {
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return null;
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  createDestination(data: CreateDestinationRequest): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of({ success: false, message: 'Token non disponible' });
    }

    return this.http.post<any>(this.apiUrl, data, { headers }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        console.error('Erreur lors de la création de la destination:', error);
        return of({ 
          success: false, 
          message: error.error?.message || 'Erreur lors de la création',
          errors: error.error?.errors || {}
        });
      })
    );
  }

  /**
   * Récupérer les package templates depuis Console Connect API
   * @param filters Filtres optionnels (country_code, search_id, status)
   */
  getPackagesFromConsoleConnect(filters?: { country_code?: string; search_id?: string; status?: string }): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of({ success: false, message: 'Token non disponible', templates: [] });
    }

    // Construire les paramètres de requête
    let params: any = {};
    if (filters) {
      if (filters.country_code) params.country_code = filters.country_code;
      if (filters.search_id) params.search_id = filters.search_id;
      if (filters.status) params.status = filters.status;
    }

    const endpoint = `${this.apiUrl}/packages-from-console-connect`;
    console.log('🔍 getPackagesFromConsoleConnect: Récupération depuis Console Connect', {
      endpoint,
      filters
    });

    return this.http.get<any>(endpoint, { headers, params }).pipe(
      map((response: any) => {
        console.log('✅ getPackagesFromConsoleConnect: Templates reçus', {
          count: response.templates?.length || 0,
          total: response.total || 0
        });
        return response;
      }),
      catchError((error) => {
        console.error('❌ Erreur lors de la récupération des templates Console Connect:', error);
        return of({
          success: false,
          message: error.error?.message || 'Erreur lors de la récupération des templates',
          templates: [],
          count: 0
        });
      })
    );
  }

  /**
   * Publier une destination (passer du brouillon au mode publié)
   * @param countryCode Code pays Alpha-2
   */
  publishDestination(countryCode: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of({ success: false, message: 'Token non disponible' });
    }

    const endpoint = `${this.apiUrl}/${countryCode}/publish`;
    console.log('🚀 publishDestination: Envoi requête POST', {
      endpoint,
      countryCode
    });

    return this.http.post<any>(endpoint, {}, { headers }).pipe(
      map((response: any) => {
        console.log('✅ publishDestination: Réponse reçue', response);
        return response;
      }),
      catchError((error) => {
        console.error('❌ Erreur lors de la publication de la destination:', error);
        return of({ 
          success: false, 
          message: error.error?.message || 'Erreur lors de la publication'
        });
      })
    );
  }
}
