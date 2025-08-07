import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../partials/header/header.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [HeaderComponent, RouterLink, TranslateModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit{
constructor(private contactService:ContactService){}
ngOnInit(): void {

}
name: any;
email: any;
message: any;
contacter(){
  const mess={
    name:this.name,
    email:this.email,
    message:this.message
  }
  this.contactService.contact(mess).subscribe((response:any)=>{
    console.log(response)
    this.showMessage('success', 'Félicitations', `${response.message}`);
  },
  (error: any) => {
    // Gestion des erreurs lors de l'inscription
    console.error('Erreur de contact :', error);

    if (error.status === 400) {
      this.showMessage('error', 'Erreur de validation', 'Veuillez vérifier les informations saisies.');
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
  })
}

 showMessage(icon:any, titre:any, texte:any){
    Swal.fire({
      icon: icon,
      title: titre,
      text: texte,
      confirmButtonColor: `var(--couleur)`,
      showConfirmButton: false,
      timer:2000,
    })
  }  
}
