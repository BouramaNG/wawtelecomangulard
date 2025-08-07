import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../shared/api_url';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }
   // methode pour l'inscription
   register(user:any){
    return this.http.post(`${url}register`, user)
  }

  // methode pour la connexion
  login(user:any){
    return this.http.post(`${url}login`, user)
  }

  logout() {
    const token = localStorage.getItem('token');
    console.log(token);
  
    if (token) {
      // Faire la requête de déconnexion
      return this.http.post<any>(`${url}logout`, {}, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}` 
        })
      });
    } else {
      return of(null);
    }
  }
}
