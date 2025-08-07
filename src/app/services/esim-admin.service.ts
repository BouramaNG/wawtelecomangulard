import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { url } from '../shared/api_url';

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
}

@Injectable({
  providedIn: 'root'
})
export class EsimAdminService {

  private apiUrl = `${url}admin/esims`;

  constructor(private http: HttpClient) { }

  getEsims(): Observable<EsimResponse> {
    return this.http.get<EsimResponse>(`${this.apiUrl}/data`);
  }

  updateEsimStatus(id: number, status: Partial<Esim>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, status);
  }

  deleteEsim(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
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