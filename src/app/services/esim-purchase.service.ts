import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { url } from '../shared/api_url';

export interface Destination {
  country: string;
  packages: Package[];
  available_esims: number;
}

export interface Package {
  id: number;
  name: string;
  price: number;
  data_limit: number;
  validity_days: number;
  supported_countries: string;
}

export interface AvailabilityCheck {
  available: boolean;
  message: string;
  esim_id?: number;
  price?: number;
  alternatives?: Package[];
}

export interface PurchaseRequest {
  destination: string;
  package_template_id: number;
  amount: number;
  payment_method: string;
  email: string;
  phone?: string;
  user_id?: number;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  data?: {
    order_id: number;
    esim_id: number;
    activation_code: string;
    qr_code: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EsimPurchaseService {

  constructor(private http: HttpClient) { }

  /**
   * Obtenir les destinations disponibles
   */
  getAvailableDestinations(): Observable<{success: boolean, destinations: Destination[]}> {
    return this.http.get<{success: boolean, destinations: Destination[]}>(`${url}esim-purchase/destinations`);
  }

  /**
   * Vérifier la disponibilité d'une offre
   */
  checkAvailability(destination: string, packageTemplateId: number): Observable<AvailabilityCheck> {
    return this.http.post<AvailabilityCheck>(`${url}esim-purchase/check-availability`, {
      destination,
      package_template_id: packageTemplateId
    });
  }

  /**
   * Traiter l'achat après paiement validé
   */
  processPurchase(purchaseData: PurchaseRequest): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(`${url}esim-purchase/process`, purchaseData);
  }

  /**
   * Obtenir les détails d'une commande
   */
  getOrderDetails(orderId: number): Observable<{success: boolean, order: any}> {
    return this.http.get<{success: boolean, order: any}>(`${url}esim-purchase/order/${orderId}`);
  }

  /**
   * Formater le prix pour l'affichage
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  }

  /**
   * Formater la limite de données
   */
  formatDataLimit(limit: number): string {
    if (limit >= 1024) {
      return `${(limit / 1024).toFixed(1)} Go`;
    }
    return `${limit} Mo`;
  }

  /**
   * Formater la validité
   */
  formatValidity(days: number): string {
    if (days === 1) {
      return '1 jour';
    } else if (days < 7) {
      return `${days} jours`;
    } else if (days === 7) {
      return '1 semaine';
    } else if (days < 30) {
      return `${Math.floor(days / 7)} semaines`;
    } else if (days === 30) {
      return '1 mois';
    } else {
      return `${Math.floor(days / 30)} mois`;
    }
  }
} 