import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  newsletterEmail: string = '';

  ngOnInit(): void {
  }

  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    if (this.newsletterEmail && this.newsletterEmail.includes('@')) {
      // TODO: Implement newsletter subscription
      console.log('Newsletter subscription:', this.newsletterEmail);
      alert('Merci pour votre inscription !');
      this.newsletterEmail = '';
    } else {
      alert('Veuillez entrer une adresse email valide.');
    }
  }
}
