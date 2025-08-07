import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../shared/api_url';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsoleConnectService {

  constructor(private http: HttpClient) { }

  /**
   * Déclencher la synchronisation Console Connect
   */
  triggerSync(limit: number = 50, includePackages: boolean = false): Observable<any> {
    const token = localStorage.getItem('token');
    const params = {
      limit: limit,
      packages: includePackages
    };

    return this.http.post(`${url}console-connect/sync`, params, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }

  /**
   * Obtenir le statut de la synchronisation
   */
  getSyncStatus(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${url}console-connect/status`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }

  /**
   * Obtenir les logs de synchronisation
   */
  getSyncLogs(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${url}console-connect/logs`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }

  /**
   * Tester la connexion Console Connect
   */
  testConnection(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${url}console-connect/test`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }

  /**
   * Obtenir les statistiques de synchronisation
   */
  getSyncStats(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${url}console-connect/stats`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}` 
      })
    });
  }
} 