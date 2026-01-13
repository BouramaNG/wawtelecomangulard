import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatbotMessage, ChatbotResponse, Destination, Package } from '../../../services/chatbot.service';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrl: './chatbot-widget.component.css'
})
export class ChatbotWidgetComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('chatInput') private chatInput!: ElementRef;

  isOpen = false;
  isLoading = false;
  sessionId: string | null = null;
  messages: ChatbotMessage[] = [];
  currentMessage = '';
  destinations: Destination[] = [];
  packages: Package[] = [];
  currentDestination: string | null = null;
  selectedPackage: Package | null = null;
  showEmailInput = false;
  emailInput = '';
  showQrCode = false;
  qrCodeUrl: string | null = null;
  conversationHistory: string[] = []; // Historique des étapes
  showHelpModal = false;
  helpQuestions: any[] = [];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    // Ne pas initialiser automatiquement au chargement, attendre l'ouverture
    // La session sera créée quand l'utilisateur ouvre le chatbot
  }

  ngOnDestroy(): void {
    // Restaurer le scroll de la page
    document.body.style.overflow = '';
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  /**
   * Initialiser la session
   * @param forceNew Si true, force la création d'une nouvelle session (ignore localStorage)
   */
  initSession(forceNew: boolean = false): void {
    this.isLoading = true;
    
    // Si forceNew, supprimer la session sauvegardée
    if (forceNew) {
      localStorage.removeItem('chatbot_session_id');
    }
    
    const savedSessionId = forceNew ? null : localStorage.getItem('chatbot_session_id');
    
    this.chatbotService.initSession(savedSessionId || undefined).subscribe({
      next: (session) => {
        this.sessionId = session.session_id;
        this.messages = session.messages || [];
        
        // Si aucun message, afficher un message par défaut
        if (this.messages.length === 0) {
          this.messages.push({
            sender: 'bot',
            message: '👋 Bonjour ! Je suis votre assistant WAW eSIM. Comment puis-je vous aider ?',
            message_type: 'text'
          });
        }
        
        localStorage.setItem('chatbot_session_id', this.sessionId);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        // Ajouter un message d'erreur pour l'utilisateur
        this.messages.push({
          sender: 'bot',
          message: '❌ Erreur de connexion. Veuillez rafraîchir la page.',
          message_type: 'text'
        });
      }
    });
  }

  /**
   * Toggle l'ouverture/fermeture du chat
   */
  toggleChat(): void {
    const wasOpen = this.isOpen;
    this.isOpen = !this.isOpen;
    
    // Gérer le scroll de la page (empêcher le scroll quand le chatbot est ouvert sur mobile)
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Si on ouvre le chatbot (passage de fermé à ouvert)
    if (this.isOpen && !wasOpen) {
      // Réinitialiser silencieusement (sans confirmation) à chaque ouverture
      this.resetConversation(true);
      setTimeout(() => {
        this.chatInput?.nativeElement?.focus();
      }, 100);
    }
  }

  /**
   * Envoyer un message
   */
  sendMessage(message?: string, payload?: string): void {
    if (!this.sessionId) {
      this.initSession();
      return;
    }

    // Si on a un payload, on peut envoyer un message vide
    const messageText = (payload && !message) ? '' : (message || this.currentMessage.trim());
    
    if (!messageText && !payload) {
      return;
    }

    // Ajouter le message utilisateur à l'affichage
    if (messageText) {
      this.messages.push({
        sender: 'user',
        message: messageText,
        message_type: 'text'
      });
      this.currentMessage = '';
    }

    this.isLoading = true;

    this.chatbotService.sendMessage(this.sessionId, messageText, payload).subscribe({
      next: (response: ChatbotResponse) => {
        this.isLoading = false;

        // Ajouter la réponse du bot
        if (response.message) {
          const messageType: 'text' | 'destinations' | 'packages' | 'checkout' | 'qr_code' | 'help' = 
            (response.message_type as 'text' | 'destinations' | 'packages' | 'checkout' | 'qr_code' | 'help') || 'text';
          
          this.messages.push({
            sender: 'bot',
            message: response.message,
            message_type: messageType,
            metadata: response.metadata
          });
        }

        // Traiter les différents types de messages
        if (response.message_type === 'help') {
          // Chercher les questions dans response.metadata d'abord
          let helpQuestions = null;
          if (response.metadata && typeof response.metadata === 'object') {
            if (response.metadata.help_questions) {
              helpQuestions = response.metadata.help_questions;
            }
          }
          
          // Si pas trouvé, chercher dans les messages retournés
          if (!helpQuestions && response.messages && Array.isArray(response.messages)) {
            const helpMessage = response.messages.find((msg: any) => msg.message_type === 'help');
            if (helpMessage && helpMessage.metadata && helpMessage.metadata.help_questions) {
              helpQuestions = helpMessage.metadata.help_questions;
            }
          }
          
          if (helpQuestions && Array.isArray(helpQuestions) && helpQuestions.length > 0) {
            this.helpQuestions = [...helpQuestions]; // Créer une copie
            this.showHelpModal = true;
            this.conversationHistory.push('help');
          }
        }

        if (response.message_type === 'destinations' && response.destinations) {
          this.destinations = response.destinations;
          this.packages = []; // Nettoyer les packages précédents
          this.currentDestination = null; // Réinitialiser la destination courante
          this.selectedPackage = null; // Réinitialiser le package sélectionné
          // S'assurer que 'destinations' est dans l'historique
          if (this.conversationHistory.indexOf('destinations') === -1) {
            this.conversationHistory.push('destinations');
          }
        }

        if (response.message_type === 'packages' && response.packages) {
          this.packages = response.packages;
          this.currentDestination = response.destination || null;
          this.destinations = []; // Nettoyer les destinations
          this.conversationHistory.push('packages');
        }

        if (response.message_type === 'checkout' && response.package) {
          this.selectedPackage = response.package;
          this.showEmailInput = true;
          this.conversationHistory.push('checkout');
        }

        // Mettre à jour les messages si fournis
        if (response.messages) {
          this.messages = response.messages;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.messages.push({
          sender: 'bot',
          message: '❌ Une erreur s\'est produite. Veuillez réessayer.',
          message_type: 'text'
        });
      }
    });
  }

  /**
   * Sélectionner une destination
   */
  selectDestination(destination: Destination): void {
    this.sendMessage(`Je veux aller à ${destination.country_name}`, destination.country_code);
  }

  /**
   * Sélectionner un package
   */
  selectPackage(packageItem: Package): void {
    this.selectedPackage = packageItem;
    this.sendMessage(`Je choisis ${packageItem.plan_name}`, packageItem.id.toString());
  }

  /**
   * Confirmer le paiement
   */
  confirmPayment(): void {
    if (!this.selectedPackage || !this.emailInput.trim()) {
      return;
    }

    if (!this.validateEmail(this.emailInput)) {
      this.messages.push({
        sender: 'bot',
        message: '⚠️ Veuillez entrer une adresse email valide.',
        message_type: 'text'
      });
      return;
    }

    this.isLoading = true;

    this.chatbotService.createOrder(this.sessionId!, this.selectedPackage.id, this.emailInput).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success && response.payment_url) {
          // Rediriger vers le paiement
          window.location.href = response.payment_url;
        } else {
          this.messages.push({
            sender: 'bot',
            message: '❌ Erreur lors de la création de la commande.',
            message_type: 'text'
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.messages.push({
          sender: 'bot',
          message: '❌ Erreur lors de la création de la commande.',
          message_type: 'text'
        });
      }
    });
  }

  /**
   * Valider l'email
   */
  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Scroll vers le bas
   */
  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      // Erreur silencieuse pour le scroll
    }
  }

  /**
   * Formater le prix
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  }

  /**
   * Formater les données (GB) - data_limit est déjà en GB
   */
  formatData(dataLimit: number): string {
    // data_limit est déjà en GB depuis le backend
    if (dataLimit < 1) {
      return `${(dataLimit * 1024).toFixed(0)} MB`;
    }
    return `${dataLimit.toFixed(dataLimit % 1 === 0 ? 0 : 1)} GB`;
  }

  /**
   * Formater les données en GB uniquement (pour les cartes)
   */
  formatDataGB(dataLimit: number): string {
    // data_limit est déjà en GB depuis le backend
    if (dataLimit < 1) {
      return `${(dataLimit * 1024).toFixed(0)} MB`;
    }
    // Afficher sans décimales si c'est un nombre entier
    return `${dataLimit % 1 === 0 ? dataLimit.toFixed(0) : dataLimit.toFixed(1)} GB`;
  }

  /**
   * Formater la valeur des données (sans unité)
   */
  formatDataValue(dataLimit: number): string {
    if (dataLimit >= 1024) {
      return (dataLimit / 1024).toFixed(0);
    }
    return dataLimit.toString();
  }

  /**
   * Formater l'unité des données
   */
  formatDataUnit(dataLimit: number): string {
    return dataLimit >= 1024 ? 'GB' : 'MB';
  }

  /**
   * Formater la valeur du prix (sans devise)
   */
  formatPriceValue(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  /**
   * Formater le prix par GB (depuis MB)
   */
  formatPricePerGB(price: number, dataLimitMB: number): string {
    if (!price || price <= 0 || !dataLimitMB || dataLimitMB <= 0) return '0';
    const dataLimitGB = dataLimitMB / 1024;
    if (dataLimitGB <= 0) return '0';
    const pricePerGB = price / dataLimitGB;
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(pricePerGB);
  }

  /**
   * Formater le prix par GB (depuis GB directement)
   */
  formatPricePerGBFromGB(price: number, dataLimitGB: number): string {
    if (!price || price <= 0 || !dataLimitGB || dataLimitGB <= 0) return '0';
    const pricePerGB = price / dataLimitGB;
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(pricePerGB);
  }

  /**
   * Vérifier si on peut revenir en arrière
   */
  canGoBack(): boolean {
    return this.conversationHistory.length > 1 || 
           this.showEmailInput || 
           this.showHelpModal ||
           this.packages.length > 0 || 
           this.destinations.length > 0;
  }

  /**
   * Revenir en arrière selon le flux logique
   */
  goBack(): void {
    if (!this.canGoBack()) return;

    // 1. Si la modale d'aide est ouverte, la fermer et revenir au menu principal
    if (this.showHelpModal) {
      this.closeHelpModal();
      return;
    }

    // 2. Si on est dans le checkout (email input), revenir à la sélection de package
    if (this.showEmailInput) {
      this.showEmailInput = false;
      this.selectedPackage = null;
      this.emailInput = '';
      // Les packages sont déjà affichés, pas besoin de recharger
      return;
    }

    // 3. Si on a des packages affichés, revenir aux destinations
    if (this.packages.length > 0) {
      // Vider immédiatement les packages pour un retour visuel instantané
      this.packages = [];
      this.currentDestination = null;
      this.selectedPackage = null;
      // Retirer 'packages' de l'historique
      const packagesIndex = this.conversationHistory.indexOf('packages');
      if (packagesIndex !== -1) {
        this.conversationHistory.splice(packagesIndex, 1);
      }
      // Réinitialiser l'étape de la session pour forcer le retour aux destinations
      // Envoyer un message avec le payload explicite
      this.sendMessage('', 'view_destinations');
      return;
    }

    // 4. Si on a des destinations affichées, revenir au menu principal
    if (this.destinations.length > 0) {
      // Vider immédiatement les destinations
      this.destinations = [];
      // Retirer 'destinations' de l'historique
      const destinationsIndex = this.conversationHistory.indexOf('destinations');
      if (destinationsIndex !== -1) {
        this.conversationHistory.splice(destinationsIndex, 1);
      }
      // Réinitialiser la session pour revenir au welcome
      // Envoyer un message vide pour réinitialiser, puis le message de bienvenue
      this.sendMessage('', ''); // Message vide pour réinitialiser l'étape
      setTimeout(() => {
        this.sendMessage('👋 Bonjour', '');
      }, 200);
      return;
    }
  }

  /**
   * Fermer la modale d'aide
   */
  closeHelpModal(): void {
    this.showHelpModal = false;
    this.helpQuestions = [];
    // Retirer 'help' de l'historique
    const helpIndex = this.conversationHistory.indexOf('help');
    if (helpIndex !== -1) {
      this.conversationHistory.splice(helpIndex, 1);
    }
    // Vider les destinations et packages pour revenir au menu
    this.destinations = [];
    this.packages = [];
    this.currentDestination = null;
    this.selectedPackage = null;
    // Revenir au menu principal avec les 2 boutons (sans payload pour forcer le welcome)
    this.sendMessage('', ''); // Message vide pour réinitialiser
    // Attendre un peu puis envoyer le message de bienvenue
    setTimeout(() => {
      this.sendMessage('👋 Bonjour', '');
    }, 100);
  }

  /**
   * Appeler le support
   */
  callSupport(phone: string): void {
    window.location.href = `tel:${phone}`;
  }

  /**
   * TrackBy pour ngFor des questions
   */
  trackByQuestion(index: number, question: any): any {
    return question.question || index;
  }

  /**
   * Réinitialiser la conversation
   * @param silent Si true, ne demande pas de confirmation (pour réinitialisation automatique)
   */
  resetConversation(silent: boolean = false): void {
    if (!silent && !confirm('Voulez-vous vraiment recommencer la conversation ?')) {
      return;
    }
    
    // Supprimer la session du localStorage
    localStorage.removeItem('chatbot_session_id');
    
    // Réinitialiser toutes les variables
    this.messages = [];
    this.destinations = [];
    this.packages = [];
    this.currentDestination = null;
    this.selectedPackage = null;
    this.showEmailInput = false;
    this.emailInput = '';
    this.showQrCode = false;
    this.qrCodeUrl = null;
    this.conversationHistory = [];
    this.showHelpModal = false;
    this.helpQuestions = [];
    this.sessionId = null;
    
    // Réinitialiser la session (force nouvelle session)
    this.initSession(true);
  }
}

