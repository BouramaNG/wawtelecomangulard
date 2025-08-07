import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = 'MaClefSecrete123!@#';  

  encryptData(data: any): string {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    } catch (error) {
      console.error('Erreur de chiffrement :', error);
      return '';
    }
  }

  decryptData(ciphertext: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Erreur de déchiffrement :', error);
      return null;
    }
  }
}
