import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { url as API_URL } from '../shared/api_url';

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

  constructor(private http: HttpClient) { }

  createTemplate(templateData: TemplateCreateRequest): Observable<TemplateCreateResponse> {
    return this.http.post<TemplateCreateResponse>(`${API_URL}admin/package-templates`, templateData);
  }

  getTemplates(): Observable<TemplateCreateResponse> {
    return this.http.get<TemplateCreateResponse>(`${API_URL}admin/package-templates`);
  }
} 