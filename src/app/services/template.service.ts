import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { url as API_URL } from '../shared/api_url';
import { EncryptionService } from './encryption.service';

export interface TemplateCreateRequest {
  name: string;
  notes?: string;
  activation_type: string;
  data_usage_allowance: number;
  voice_usage_allowance: number;
  sms_usage_allowance: number;
  activation_time_allowance: number;
  earliest_activation_date: string;
  earliest_available_date: string;
  latest_available_date: string;
  supported_countries: string[];
  traffic_policy: number;
  time_allowance: {
    unit: string;
    duration: number;
  };
  inventory: number;
}

export interface TemplateCreateResponse {
  success: boolean;
  template?: any;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) { }

  createTemplate(templateData: TemplateCreateRequest): Observable<TemplateCreateResponse> {
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of({ success: false, error: 'Token non disponible' });
    }
    return this.http.post<TemplateCreateResponse>(`${API_URL}admin/package-templates`, templateData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  getTemplates(): Observable<TemplateCreateResponse> {
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      return of({ success: false, error: 'Token non disponible' });
    }
    return this.http.get<TemplateCreateResponse>(`${API_URL}admin/package-templates`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }
} 