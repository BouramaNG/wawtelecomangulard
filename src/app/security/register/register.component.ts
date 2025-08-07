import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, NgSelectModule, CommonModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent  implements OnInit{
  prenom: any;
  email: any;
  password: any;
  telephone: any;
  passwordConf: any;
  nom: any;
  selectedIndicatif: any = ''; 
  indicatifs = [
    { "ind": "+33", "drapeau": "https://flagcdn.com/w320/fr.png" }, // France
    { "ind": "+212", "drapeau": "https://flagcdn.com/w320/ma.png" }, // Maroc
    { "ind": "+1", "drapeau": "https://flagcdn.com/w320/us.png" }, // États-Unis
    { "ind": "+34", "drapeau": "https://flagcdn.com/w320/es.png" }, // Espagne
    { "ind": "+39", "drapeau": "https://flagcdn.com/w320/it.png" }, // Italie
    { "ind": "+971", "drapeau": "https://flagcdn.com/w320/ae.png" }, // Émirats Arabes Unis
    { "ind": "+90", "drapeau": "https://flagcdn.com/w320/tr.png" }, // Turquie
    { "ind": "+86", "drapeau": "https://flagcdn.com/w320/cn.png" }, // Chine
    { "ind": "+27", "drapeau": "https://flagcdn.com/w320/za.png" }, // Afrique du Sud
    { "ind": "+44", "drapeau": "https://flagcdn.com/w320/gb.png" }, // Royaume-Uni
    { "ind": "+225", "drapeau": "https://flagcdn.com/w320/ci.png" }, // Côte d'Ivoire
    { "ind": "+1", "drapeau": "https://flagcdn.com/w320/ca.png" }, // Canada
    { "ind": "+254", "drapeau": "https://flagcdn.com/w320/ke.png" }, // Kenya
    { "ind": "+221", "drapeau": "https://flagcdn.com/w320/sn.png" } // Senegal
  ];
  
  constructor(private loginService: LoginService, private route: Router,){}
ngOnInit(): void {
  this.selectedIndicatif = this.indicatifs.length ? this.indicatifs[13].ind : null;
  console.log(this.indicatifs)
}

  // methode pour l'inscription
inscription() {
  // Vérifications avant envoi
  if (!this.selectedIndicatif || !this.telephone) {
    this.showMessage('error', 'Erreur', 'Veuillez renseigner un numéro de téléphone complet');
    return;
  }

  if (this.password !== this.passwordConf) {
    this.showMessage('error', 'Erreur', 'Les mots de passe ne correspondent pas');
    return;
  }

  const user = {
    name: `${this.prenom} ${this.nom}`,
    email: this.email,
    password: this.password,
    password_confirmation: this.passwordConf,
    phone: this.selectedIndicatif + this.telephone,
    role_id: 2
  };

  // Vérification du format
  if (!/^\+\d+$/.test(this.selectedIndicatif)) {
    this.showMessage('error', 'Erreur', 'Format d\'indicatif invalide');
    return;
  }
  this.loginService.register(user).subscribe(
    (response: any) => {
      if (response && response.token) {
        // L'inscription a réussi, stockage des informations et navigation
        console.log('Token :', response.token);
        this.showMessage('success', 'Félicitations', 'Bienvenue sur Waw !');
        this.route.navigate(['/login']);
      } else {
        // En cas d'absence de token, indiquer que quelque chose s'est mal passé
        this.showMessage('error', 'Attention', 'Veuillez vérifier vos informations.');
      }
    },
    (error: any) => {
      // Gestion des erreurs lors de l'inscription
      console.error('Erreur d\'inscription :', error);

      if (error.status === 400) {
        this.showMessage('error', 'Erreur de validation', 'Veuillez vérifier les informations saisies.');
      } else if (error.status === 409) {
        this.showMessage('error', 'Conflit', 'Un compte avec cet email existe déjà.');
      } else if (error.status === 500) {
        this.showMessage('error', 'Erreur serveur', 'Une erreur est survenue, veuillez réessayer plus tard.');
      }else if (error.status === 422) {
        const validationErrors = error.error;
        let errorMessage = "Erreur de validation :\n";
        for (const [field, messages] of Object.entries(validationErrors)) {
          errorMessage += `${field}: ${(messages as string[]).join(', ')}\n`;
        }
        this.showMessage('error', 'Erreur de validation', errorMessage);
      }
       else {
        this.showMessage('error', 'Erreur', 'Une erreur inattendue est survenue.');
      }
    }
  );
}
showMessage(icon:any, titre:any, texte:any){
  Swal.fire({
    icon: icon,
    title: titre,
    text: texte,
    confirmButtonColor: "#ffdd33",
  })
}

}
