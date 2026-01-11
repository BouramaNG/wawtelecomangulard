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
}



