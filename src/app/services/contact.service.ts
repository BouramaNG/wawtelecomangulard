import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../shared/api_url';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http:HttpClient) { }
  contact(info:any){
    return this.http.post(`${url}contact`, info)
  }
}
