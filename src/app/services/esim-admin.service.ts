import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { url } from '../shared/api_url';
import { EncryptionService } from './encryption.service';

export interface Esim {
  id: number;
  iccid: string;
  activation_code: string;
  sm_dp_address: string;
  lpa: string;
  is_assigned: boolean;
  assigned_at: string | null;
  esim_package_id: number | null;
  created_at: string;
  updated_at: string;
  esim_package?: {
    name: string;
    destination: string;
    price: number;
  };
}

export interface EsimStats {
  total: number;
  assigned: number;
  unassigned: number;
  recently_assigned: number;
  by_package: Array<{
    esim_package_id: number;
    count: number;
  }>;
}

export interface EsimResponse {
  success: boolean;
  esims: Esim[];
  stats: EsimStats;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EsimAdminService {

  private apiUrl = `${url}admin/esims`;

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
      Authorization: `Bearer ${token}`
    });
  }

  /**
   * Récupérer les eSIMs avec pagination côté serveur
   * @param params Paramètres de pagination et filtres (page, per_page, search, status, inventory)
   */
  getEsims(params?: { page?: number; per_page?: number; search?: string; status?: string; inventory?: string }): Observable<EsimResponse> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of({ success: false, esims: [], stats: { total: 0, assigned: 0, unassigned: 0, recently_assigned: 0, by_package: [] } } as EsimResponse);
    }

    // Construire les paramètres de requête
    const queryParams: any = {};
    if (params) {
      if (params.page) queryParams.page = params.page;
      if (params.per_page) queryParams.per_page = params.per_page;
      if (params.search) queryParams.search = params.search;
      if (params.status) queryParams.status = params.status;
      if (params.inventory) queryParams.inventory = params.inventory;
    }
    
    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${this.apiUrl}${queryString ? '?' + queryString : ''}`;
    
    console.log('🔵 [ESIM-SERVICE] Récupération eSIMs avec pagination:', fullUrl);

    return this.http.get<any>(fullUrl, { headers }).pipe(
      map((response: any) => {
        console.log('🟢 [ESIM-SERVICE] Réponse eSIMs:', response);
        
        // Format Laravel pagination: { data: [...], current_page, per_page, total, last_page, etc. }
        if (response.data && Array.isArray(response.data)) {
          return {
            success: true,
            esims: response.data,
            stats: response.stats || {
              total: response.total || response.data.length,
              assigned: 0,
              unassigned: 0,
              recently_assigned: 0,
              by_package: []
            },
            pagination: {
              current_page: response.current_page || 1,
              per_page: response.per_page || response.data.length,
              total: response.total || response.data.length,
              last_page: response.last_page || 1,
              from: response.from || 0,
              to: response.to || response.data.length
            }
          } as EsimResponse;
        }
        
        // Format backend actuel: { success: true, esims: [...], pagination: {...}, stats: {...} }
        if (response.esims && Array.isArray(response.esims)) {
          // Si pagination existe dans la réponse, l'utiliser (format exact du backend)
          if (response.pagination) {
            const currentPage = response.pagination.current_page || 1;
            const perPage = response.pagination.per_page || response.esims.length;
            const total = response.pagination.total || 0;
            const lastPage = response.pagination.last_page || 1;
            
            // Calculer from et to si non fournis
            const from = response.pagination.from !== undefined ? response.pagination.from : ((currentPage - 1) * perPage + 1);
            const to = response.pagination.to !== undefined ? response.pagination.to : Math.min(currentPage * perPage, total);
            
            return {
              success: true,
              esims: response.esims,
              stats: response.stats || {
                total: total,
                assigned: 0,
                unassigned: 0,
                recently_assigned: 0,
                by_package: []
              },
              pagination: {
                current_page: currentPage,
                per_page: perPage,
                total: total,
                last_page: lastPage,
                from: from,
                to: to
              }
            } as EsimResponse;
          }
          
          // Sinon, créer une pagination par défaut
          return {
            success: true,
            esims: response.esims,
            stats: response.stats || {
              total: response.total || response.esims.length,
              assigned: response.esims.filter((e: any) => e.is_assigned === 1 || e.is_assigned === true).length,
              unassigned: response.esims.filter((e: any) => e.is_assigned === 0 || e.is_assigned === false).length,
              recently_assigned: 0,
              by_package: []
            },
            pagination: response.pagination || {
              current_page: 1,
              per_page: response.esims.length,
              total: response.esims.length,
              last_page: 1,
              from: 1,
              to: response.esims.length
            }
          } as EsimResponse;
        }
        
        // Si la réponse est un tableau directement (format non paginé)
        if (Array.isArray(response)) {
          return {
            success: true,
            esims: response,
            stats: {
              total: response.length,
              assigned: response.filter((e: any) => e.is_assigned === 1 || e.is_assigned === true).length,
              unassigned: response.filter((e: any) => e.is_assigned === 0 || e.is_assigned === false).length,
              recently_assigned: 0,
              by_package: []
            },
            pagination: {
              current_page: 1,
              per_page: response.length,
              total: response.length,
              last_page: 1,
              from: 1,
              to: response.length
            }
          } as EsimResponse;
        }
        
        // Fallback
        console.warn('🟡 [ESIM-SERVICE] Format de réponse inattendu:', response);
        return {
          success: false,
          esims: [],
          stats: { total: 0, assigned: 0, unassigned: 0, recently_assigned: 0, by_package: [] }
        } as EsimResponse;
      }),
      catchError((error) => {
        console.error('🔴 [ESIM-SERVICE] Erreur lors de la récupération des eSIMs:', error);
        return of({
          success: false,
          esims: [],
          stats: { total: 0, assigned: 0, unassigned: 0, recently_assigned: 0, by_package: [] }
        } as EsimResponse);
      })
    );
  }

  updateEsimStatus(id: number, status: Partial<Esim>): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of({ error: 'Token non disponible' });
    }
    return this.http.put(`${this.apiUrl}/${id}/status`, status, { headers });
  }

  deleteEsim(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of({ error: 'Token non disponible' });
    }
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available':
        return 'success';
      case 'assigned':
        return 'primary';
      case 'activated':
        return 'info';
      case 'expired':
        return 'warning';
      case 'error':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'assigned':
        return 'Assignée';
      case 'activated':
        return 'Activée';
      case 'expired':
        return 'Expirée';
      case 'error':
        return 'Erreur';
      default:
        return 'Inconnu';
    }
  }
} 