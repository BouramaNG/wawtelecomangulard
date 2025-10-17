import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss']
})
export class WhatsappButtonComponent implements OnInit {
  // Numéro de téléphone WhatsApp
  whatsappNumber = '221763644946';
  // Message par défaut
  defaultMessage = 'Bonjour, je souhaite acheter une eSIM';

  constructor() { }

  ngOnInit(): void {
  }

  openWhatsApp() {
    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(this.defaultMessage);
    // Ouvrir le chat WhatsApp
    window.open(`https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`, '_blank');
  }
}
