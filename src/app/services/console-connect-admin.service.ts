import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { url as API_URL } from '../shared/api_url';
import { EncryptionService } from './encryption.service';

export interface ConsoleConnectEsim {
  id: string;
  iccid?: string;
  activation_code?: string;
  status?: string;
  destination?: string;
  data_limit?: string;
  validity_days?: number;
  price?: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Pour les autres propriétés dynamiques
}

export interface ConsoleConnectPackage {
  id: string;
  name?: string;
  destination?: string;
  data_limit?: string;
  validity_days?: number;
  price?: number;
  currency?: string;
  description?: string;
  features?: string[];
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Pour les autres propriétés dynamiques
}

export interface ConsoleConnectStats {
  total_esims: number;
  total_packages: number;
  esims_by_status: { [key: string]: number };
  packages_by_destination: { [key: string]: number };
}

export interface ConsoleConnectApiInfo {
  base_url: string;
  last_sync: string;
  total_api_calls: number;
}

export interface ConsoleConnectResponse {
  success: boolean;
  esims?: ConsoleConnectEsim[];
  packages?: ConsoleConnectPackage[];
  stats?: ConsoleConnectStats;
  api_info?: ConsoleConnectApiInfo;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsoleConnectAdminService {

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
   * Récupère toutes les eSIMs depuis Console Connect
   */
  getEsimsFromConsoleConnect(): Observable<ConsoleConnectResponse> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of({ success: false, error: 'Token non disponible' });
    }
    return this.http.get<ConsoleConnectResponse>(`${API_URL}admin/console-connect/esims`, { headers });
  }

  /**
   * Récupère les détails d'une eSIM spécifique depuis Console Connect
   */
  getEsimDetails(esimId: string): Observable<ConsoleConnectResponse> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of({ success: false, error: 'Token non disponible' });
    }
    return this.http.get<ConsoleConnectResponse>(`${API_URL}admin/console-connect/esims/${esimId}/details`, { headers });
  }

  /**
   * Récupère les détails d'un package spécifique depuis Console Connect
   */
  getPackageDetails(packageId: string): Observable<ConsoleConnectResponse> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return of({ success: false, error: 'Token non disponible' });
    }
    return this.http.get<ConsoleConnectResponse>(`${API_URL}admin/console-connect/packages/${packageId}/details`, { headers });
  }

  /**
   * Formate le statut pour l'affichage
   */
  formatStatus(status: string | undefined): string {
    if (!status) return 'Inconnu';
    
    const statusMap: { [key: string]: string } = {
      'active': 'Actif',
      'inactive': 'Inactif',
      'pending': 'En attente',
      'expired': 'Expiré',
      'suspended': 'Suspendu',
      'unknown': 'Inconnu'
    };
    return statusMap[status] || status;
  }

  /**
   * Formate la destination pour l'affichage
   */
  formatDestination(destination: string | undefined): string {
    if (!destination) return 'Inconnu';
    
    const destinationMap: { [key: string]: string } = {
      'france': 'France',
      'china': 'Chine',
      'usa': 'États-Unis',
      'uk': 'Royaume-Uni',
      'germany': 'Allemagne',
      'spain': 'Espagne',
      'italy': 'Italie',
      'japan': 'Japon',
      'australia': 'Australie',
      'canada': 'Canada',
      'brazil': 'Brésil',
      'india': 'Inde',
      'south_africa': 'Afrique du Sud'
    };
    return destinationMap[destination] || destination;
  }

  /**
   * Formate la limite de données pour l'affichage
   */
  formatDataLimit(dataLimit: string | undefined): string {
    if (!dataLimit) return 'Non spécifié';
    
    // Si c'est déjà formaté (contient GB, MB, etc.)
    if (dataLimit.includes('GB') || dataLimit.includes('MB')) {
      return dataLimit;
    }
    
    // Sinon, on suppose que c'est en MB
    const mb = parseInt(dataLimit);
    if (isNaN(mb)) return 'Non spécifié';
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb} MB`;
  }

  /**
   * Formate le prix pour l'affichage
   */
  formatPrice(price: number | undefined, currency: string | undefined = 'EUR'): string {
    if (!price || isNaN(price)) return 'Non spécifié';
    
    const currencySymbols: { [key: string]: string } = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
      'CNY': '¥'
    };
    
    const symbol = currencySymbols[currency || 'EUR'] || currency || 'EUR';
    return `${price.toFixed(2)} ${symbol}`;
  }

  /**
   * Formate la date pour l'affichage
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'Non spécifié';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtient la classe CSS pour le statut
   */
  getStatusClass(status: string | undefined): string {
    if (!status) status = 'unknown';
    
    const statusClasses: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'expired': 'bg-red-100 text-red-800',
      'suspended': 'bg-orange-100 text-orange-800',
      'unknown': 'bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }
} 