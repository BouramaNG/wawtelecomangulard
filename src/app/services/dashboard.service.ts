import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { url } from '../shared/api_url';
import { EncryptionService } from './encryption.service';

export interface DashboardStats {
  total_esims: number;
  available_esims: number;
  in_service_esims: number;
  terminated_esims: number;
  active_packages: number;
  active_templates: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  active_partners: number;
  monthly_revenue: number;
  today_orders: number;
  today_revenue: number;
}

export interface SalesChartData {
  labels: string[];
  revenues: number[];
  orders: number[];
}

export interface EsimStatusChartData {
  labels: string[];
  data: number[];
}

export interface RecentActivity {
  type: 'order' | 'package' | 'esim';
  title: string;
  description: string;
  time: string;
  created_at: string;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
  charts: {
    sales: SalesChartData;
    esim_status: EsimStatusChartData;
  };
  activities: RecentActivity[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) { }

  /**
   * Récupère le token déchiffré depuis localStorage
   * Gère les cas où le token est chiffré ou non
   */
  private getToken(): string | null {
    const tokenStored = localStorage.getItem('token');
    if (!tokenStored) {
      console.warn('Aucun token trouvé dans localStorage');
      return null;
    }
    
    // Le token est stocké chiffré (via encryptData dans login.component.ts)
    // encryptData fait JSON.stringify("token") puis chiffre
    // Donc decryptData doit retourner "token" (string)
    
    try {
      const decrypted = this.encryptionService.decryptData(tokenStored);
      
      if (!decrypted) {
        // Si decryptData retourne null, le déchiffrement a échoué
        // Peut-être que le token n'est pas chiffré (ancien format)
        console.warn('Déchiffrement échoué, tentative avec token brut');
        // Vérifier si le token brut ressemble à un JWT (commence par eyJ)
        if (tokenStored.startsWith('eyJ') || tokenStored.length > 100) {
          return tokenStored;
        }
        return null;
      }
      
      // decryptData fait JSON.parse, donc pour "token", il retourne "token" (string)
      if (typeof decrypted === 'string' && decrypted.trim().length > 0) {
        // Vérifier que c'est un JWT valide (commence par eyJ)
        const cleanToken = decrypted.trim();
        if (cleanToken.startsWith('eyJ') || cleanToken.length > 50) {
          return cleanToken;
        }
        console.warn('Token déchiffré ne ressemble pas à un JWT valide:', cleanToken.substring(0, 20));
      }
      
      // Si c'est un objet (ne devrait pas arriver pour un token)
      if (typeof decrypted === 'object') {
        console.warn('Token déchiffré est un objet:', decrypted);
        // Peut-être que le token est dans une propriété
        if ((decrypted as any).token) {
          return (decrypted as any).token;
        }
        return null;
      }
      
      // En dernier recours, utiliser le token brut si il ressemble à un JWT
      if (tokenStored.startsWith('eyJ') || tokenStored.length > 100) {
        console.warn('Utilisation du token brut comme fallback');
        return tokenStored;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors du déchiffrement du token:', error);
      // Si le token brut ressemble à un JWT, l'utiliser directement
      if (tokenStored.startsWith('eyJ') || tokenStored.length > 100) {
        console.warn('Utilisation du token brut après erreur de déchiffrement');
        return tokenStored;
      }
      return null;
    }
  }

  /**
   * Récupère toutes les statistiques du dashboard
   */
  getStats(): Observable<DashboardResponse> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Token non trouvé');
    }
    
    return this.http.get<DashboardResponse>(`${url}admin/dashboard/stats`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  /**
   * Récupère uniquement les statistiques (sans graphiques)
   */
  getStatsOnly(): Observable<DashboardStats> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('Token non trouvé');
    }
    
    return this.http.get<DashboardStats>(`${url}admin/dashboard/stats`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }
}

