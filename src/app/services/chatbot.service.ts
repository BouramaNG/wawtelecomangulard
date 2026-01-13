import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { url } from '../shared/api_url';

export interface ChatbotMessage {
  id?: number;
  sender: 'user' | 'bot';
  message: string;
  message_type: 'text' | 'destinations' | 'packages' | 'checkout' | 'qr_code' | 'help';
  metadata?: any;
  created_at?: string;
}

export interface ChatbotSession {
  session_id: string;
  messages?: ChatbotMessage[];
}

export interface ChatbotResponse {
  success: boolean;
  message?: string;
  message_type?: 'text' | 'destinations' | 'packages' | 'checkout' | 'qr_code' | 'help';
  metadata?: any;
  destinations?: any[];
  packages?: any[];
  destination?: string;
  package?: any;
  next_step?: string;
  payment_redirect?: boolean;
  payment_url?: string;
  messages?: ChatbotMessage[];
  session_id?: string;
}

export interface Destination {
  country_code: string;
  country_name: string;
  flag_image_url?: string;
  network_provider?: string;
}

export interface Package {
  id: number;
  plan_name: string;
  data_limit: number; // En GB
  data_limit_mb?: number; // En MB (optionnel, peut être calculé depuis data_limit)
  validity_days: number;
  price: number;
  network_provider?: string;
  country_code?: string;
  country_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = url;
  private sessionIdSubject = new BehaviorSubject<string | null>(null);
  public sessionId$ = this.sessionIdSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Initialiser ou récupérer une session
   */
  initSession(sessionId?: string): Observable<ChatbotSession> {
    const endpoint = `${this.apiUrl}chatbot/session`;
    const payload = sessionId ? { session_id: sessionId } : {};
    
    return new Observable(observer => {
      this.http.post<any>(endpoint, payload).subscribe({
        next: (response) => {
          if (response.success && response.session_id) {
            this.sessionIdSubject.next(response.session_id);
            observer.next({
              session_id: response.session_id,
              messages: response.messages || []
            });
          } else {
            observer.error('Erreur lors de l\'initialisation de la session');
          }
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Envoyer un message
   */
  sendMessage(sessionId: string, message: string, payload?: string): Observable<ChatbotResponse> {
    const endpoint = `${this.apiUrl}chatbot/message`;
    const body = {
      session_id: sessionId,
      message: message,
      payload: payload || null
    };

    return new Observable(observer => {
      this.http.post<ChatbotResponse>(endpoint, body).subscribe({
        next: (response) => {
          observer.next(response);
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Récupérer l'historique des messages
   */
  getMessages(sessionId: string): Observable<ChatbotMessage[]> {
    const endpoint = `${this.apiUrl}chatbot/messages/${sessionId}`;
    
    return new Observable(observer => {
      this.http.get<any>(endpoint).subscribe({
        next: (response) => {
          if (response.success) {
            observer.next(response.messages || []);
          } else {
            observer.error('Erreur lors de la récupération des messages');
          }
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Créer une commande depuis le chatbot
   */
  createOrder(sessionId: string, packageId: number, email: string): Observable<any> {
    const endpoint = `${this.apiUrl}chatbot/create-order`;
    const body = {
      session_id: sessionId,
      package_id: packageId,
      email: email
    };

    return new Observable(observer => {
      this.http.post<any>(endpoint, body).subscribe({
        next: (response) => {
          observer.next(response);
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Vérifier le statut d'une commande
   */
  checkOrderStatus(orderId: number): Observable<any> {
    const endpoint = `${this.apiUrl}chatbot/order/${orderId}/status`;
    
    return new Observable(observer => {
      this.http.get<any>(endpoint).subscribe({
        next: (response) => {
          observer.next(response);
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * Obtenir le session ID actuel
   */
  getCurrentSessionId(): string | null {
    return this.sessionIdSubject.value;
  }
}

