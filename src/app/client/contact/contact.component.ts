import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../partials/header/header.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [HeaderComponent, RouterLink, TranslateModule, FormsModule, NgSelectModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit{
  constructor(private contactService:ContactService){}
  
  ngOnInit(): void {
    // Initialisation
  }

  // Propriétés pour le formulaire de contact
  contactFirstName: string = '';
  contactLastName: string = '';
  contactEmail: string = '';
  contactPhone: string = '';
  contactSubject: string = '';
  message: string = '';
  selectedContactIndicatif: string = '+221';

  // Liste des indicatifs téléphoniques
  indicatifs: any[] = [
    { ind: '+221', drapeau: 'https://flagcdn.com/w40/sn.png' },
    { ind: '+33', drapeau: 'https://flagcdn.com/w40/fr.png' },
    { ind: '+1', drapeau: 'https://flagcdn.com/w40/us.png' },
    { ind: '+212', drapeau: 'https://flagcdn.com/w40/ma.png' },
    { ind: '+34', drapeau: 'https://flagcdn.com/w40/es.png' },
    { ind: '+44', drapeau: 'https://flagcdn.com/w40/gb.png' },
    { ind: '+39', drapeau: 'https://flagcdn.com/w40/it.png' },
    { ind: '+49', drapeau: 'https://flagcdn.com/w40/de.png' },
    { ind: '+32', drapeau: 'https://flagcdn.com/w40/be.png' },
    { ind: '+41', drapeau: 'https://flagcdn.com/w40/ch.png' },
  ];

  contacter(){
    const mess = {
      name: `${this.contactFirstName} ${this.contactLastName}`.trim(),
      email: this.contactEmail,
      phone: this.contactPhone ? `${this.selectedContactIndicatif} ${this.contactPhone}` : '',
      subject: this.contactSubject,
      message: this.message
    };

    this.contactService.contact(mess).subscribe({
      next: (response:any) => {
        console.log(response);
        this.showMessage('success', 'Message envoyé !', response.message || 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
        this.resetForm();
      },
      error: (error: any) => {
        console.error('Erreur de contact :', error);

        if (error.status === 400) {
          this.showMessage('error', 'Erreur de validation', 'Veuillez vérifier les informations saisies.');
        } else if (error.status === 500) {
          this.showMessage('error', 'Erreur serveur', 'Une erreur est survenue, veuillez réessayer plus tard.');
        } else if (error.status === 422) {
          const validationErrors = error.error;
          let errorMessage = "Erreur de validation :\n";
          for (const [field, messages] of Object.entries(validationErrors)) {
            errorMessage += `${field}: ${(messages as string[]).join(', ')}\n`;
          }
          this.showMessage('error', 'Erreur de validation', errorMessage);
        } else {
          this.showMessage('error', 'Erreur', 'Une erreur inattendue est survenue.');
        }
      }
    });
  }

  resetForm() {
    this.contactFirstName = '';
    this.contactLastName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.contactSubject = '';
    this.message = '';
    this.selectedContactIndicatif = '+221';
  }

  showMessage(icon:any, titre:any, texte:any){
    Swal.fire({
      icon: icon,
      title: titre,
      text: texte,
      confirmButtonColor: '#FFDD33',
      confirmButtonText: 'OK',
      timer: icon === 'success' ? 3000 : undefined,
    });
  }
}
