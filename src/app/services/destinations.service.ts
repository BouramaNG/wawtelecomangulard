import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { url } from '../shared/api_url';
import { EncryptionService } from './encryption.service';

export interface Destination {
  country_code: string;
  country_name: string;
  network_provider: string;
  is_published?: boolean;
  is_active?: boolean;
  packages: Package[];
}

export interface Package {
  id: number;
  plan_name: string;
  data_limit: number;
  price: number;
  validity_days: number;
  network_provider: string;
  image: string;
  available_esims: number;
  total_esims: number;
  in_stock: boolean;
  stock_percentage: number;
}

export interface DestinationStats {
  total_destinations: number;
  total_packages: number;
  total_esims: number;
  available_esims: number;
  low_stock_packages: number;
  out_of_stock_packages: number;
}

export interface SyncResponse {
  success: boolean;
  message: string;
  output?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DestinationsService {

  private apiUrl = url;

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) { }

  // Récupérer les données pour l'admin (avec plus de détails)
  getAdminData(): Observable<{success: boolean, destinations: Destination[], stats: DestinationStats}> {
    const endpoint = `${this.apiUrl}admin/destinations/data`;
    console.log('🔄 DestinationsService: Appel API getAdminData');
    console.log('📍 URL appelée:', endpoint);
    console.log('🔗 URL complète:', endpoint);
    
    return this.http.get<{success: boolean, destinations: Destination[], stats: DestinationStats}>(endpoint);
  }

  // Récupérer toutes les destinations
  getDestinations(): Observable<{success: boolean, destinations: Destination[]}> {
    const endpoint = `${this.apiUrl}destinations`;
    console.log('🔄 DestinationsService: Appel API getDestinations');
    console.log('📍 URL appelée:', endpoint);
    
    return this.http.get<{success: boolean, destinations: Destination[]}>(endpoint);
  }

  // Récupérer les statistiques
  getStats(): Observable<{success: boolean, stats: DestinationStats}> {
    const endpoint = `${this.apiUrl}destinations/stats`;
    console.log('🔄 DestinationsService: Appel API getStats');
    console.log('📍 URL appelée:', endpoint);
    
    return this.http.get<{success: boolean, stats: DestinationStats}>(endpoint);
  }

  // Récupérer une destination spécifique
  getDestination(countryCode: string): Observable<{success: boolean, destination: Destination}> {
    const endpoint = `${this.apiUrl}destinations/${countryCode}`;
    console.log('🔄 DestinationsService: Appel API getDestination');
    console.log('📍 URL appelée:', endpoint);
    
    return this.http.get<{success: boolean, destination: Destination}>(endpoint);
  }

  // Vérifier la disponibilité d'un package
  checkAvailability(packageId: number, quantity: number = 1): Observable<{success: boolean, available: boolean, available_quantity: number, requested_quantity: number}> {
    const endpoint = `${this.apiUrl}destinations/check-availability`;
    console.log('🔄 DestinationsService: Appel API checkAvailability');
    console.log('📍 URL appelée:', endpoint);
    
    return this.http.post<{success: boolean, available: boolean, available_quantity: number, requested_quantity: number}>(endpoint, {
      package_id: packageId,
      quantity: quantity
    });
  }

  // Synchroniser les destinations avec Console Connect
  syncDestinations(limit: number = 20): Observable<SyncResponse> {
    const endpoint = `${this.apiUrl}console-connect/sync`;
    console.log('🔄 DestinationsService: Appel API syncDestinations');
    console.log('📍 URL appelée:', endpoint);
    
    return this.http.post<SyncResponse>(endpoint, {
      sync_type: 'destinations',
      limit: limit
    });
  }

  // Désactiver/Activer une destination (retirer du site web)
  toggleDestinationVisibility(countryCode: string): Observable<{success: boolean, message: string, is_published: boolean}> {
    const endpoint = `${this.apiUrl}admin/destinations/${countryCode}/toggle-visibility`;
    console.log('🔄 DestinationsService: Appel API toggleDestinationVisibility');
    console.log('📍 URL appelée:', endpoint);
    
    const token = this.encryptionService.getDecryptedToken();
    if (!token) {
      console.error('❌ DestinationsService: Token non disponible');
      return of({ success: false, message: 'Token non disponible', is_published: false });
    }
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.patch<{success: boolean, message: string, is_published: boolean}>(endpoint, {}, { headers });
  }
} 