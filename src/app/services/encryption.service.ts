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
      if (!ciphertext || typeof ciphertext !== 'string' || ciphertext.trim().length === 0) {
        console.warn('Chiffré vide ou invalide');
        return null;
      }

      const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString || decryptedString.trim().length === 0) {
        console.warn('Déchiffrement retourne une string vide - clé incorrecte ou données corrompues');
        return null;
      }

      // Essayer de parser en JSON
      try {
        return JSON.parse(decryptedString);
      } catch (parseError) {
        // Si le parsing JSON échoue, retourner la string directement
        // (cas où les données étaient un string simple)
        console.warn('JSON.parse échoué, retour de la string brute:', parseError);
        return decryptedString;
      }
    } catch (error) {
      console.error('Erreur de déchiffrement :', error);
      return null;
    }
  }

  /**
   * Récupère le token déchiffré depuis localStorage
   * Utilisé par tous les services pour obtenir le token pour les requêtes HTTP
   */
  getDecryptedToken(): string | null {
    const tokenStored = localStorage.getItem('token');
    if (!tokenStored) {
      console.warn('🔴 [ENCRYPTION] Aucun token trouvé dans localStorage');
      return null;
    }
    
    // Si le token stocké ressemble déjà à un JWT (non chiffré), le retourner directement
    // C'est le cas si on stocke directement comme waw-admin-dashboard
    if (tokenStored.startsWith('eyJ') && tokenStored.length > 100) {
      console.log('🟢 [ENCRYPTION] Token non chiffré détecté, utilisation directe');
      const cleanToken = tokenStored.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      console.log('🟢 [ENCRYPTION] Token nettoyé, longueur:', cleanToken.length);
      return cleanToken;
    }
    
    try {
      const decrypted = this.decryptData(tokenStored);
      
      if (!decrypted) {
        console.warn('Déchiffrement échoué, token peut être corrompu');
        return null;
      }
      
      // decryptData fait JSON.parse, donc pour un string "token", il retourne "token" (string)
      // Mais si encryptData a fait JSON.stringify("token"), on obtient "\"token\"" qui devient "token" après JSON.parse
      let tokenString: string | null = null;
      
      if (typeof decrypted === 'string') {
        tokenString = decrypted.trim();
        // Enlever les guillemets JSON si présents
        if (tokenString.startsWith('"') && tokenString.endsWith('"')) {
          tokenString = tokenString.slice(1, -1).trim();
        }
        // Enlever tous les espaces invisibles ou caractères de contrôle
        tokenString = tokenString.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      } else if (typeof decrypted === 'object' && decrypted !== null) {
        // Si c'est un objet, chercher une propriété token
        if ((decrypted as any).token) {
          tokenString = String((decrypted as any).token).trim();
        } else {
          console.warn('Token déchiffré est un objet sans propriété token:', decrypted);
          return null;
        }
      }
      
      if (tokenString && tokenString.length > 0) {
        // Nettoyer le token de tous les caractères invisibles
        tokenString = tokenString.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
        
        // Vérifier que c'est un JWT valide (commence par eyJ)
        if (tokenString.startsWith('eyJ') || tokenString.length > 50) {
          console.log('Token déchiffré avec succès, longueur:', tokenString.length);
          console.log('Token première partie:', tokenString.substring(0, 20));
          console.log('Token dernière partie:', tokenString.substring(tokenString.length - 20));
          // Vérifier qu'il n'y a pas de caractères étranges
          if (/^[A-Za-z0-9\-_\.]+$/.test(tokenString)) {
            console.log('Token format JWT valide');
          } else {
            console.warn('Token contient des caractères invalides');
          }
          return tokenString;
        } else {
          console.warn('Token déchiffré ne ressemble pas à un JWT valide:', tokenString.substring(0, 20));
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors du déchiffrement du token:', error);
      return null;
    }
  }
}
