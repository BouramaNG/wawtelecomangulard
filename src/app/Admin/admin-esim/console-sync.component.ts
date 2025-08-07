import { Component, OnInit } from '@angular/core';
import { ConsoleConnectService } from '../../services/console-connect.service';

@Component({
  selector: 'app-console-sync',
  templateUrl: './console-sync.component.html',
  styleUrls: ['./console-sync.component.css']
})
export class ConsoleSyncComponent implements OnInit {

  syncStatus: any = {};
  syncLogs: any[] = [];
  syncStats: any = {};
  isLoading = false;
  syncInProgress = false;

  constructor(private consoleConnectService: ConsoleConnectService) { }

  ngOnInit(): void {
    this.loadSyncStatus();
    this.loadSyncStats();
  }

  /**
   * Charger le statut de synchronisation
   */
  loadSyncStatus() {
    this.isLoading = true;
    this.consoleConnectService.getSyncStatus().subscribe({
      next: (response) => {
        this.syncStatus = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement statut:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Charger les statistiques
   */
  loadSyncStats() {
    this.consoleConnectService.getSyncStats().subscribe({
      next: (response) => {
        this.syncStats = response;
      },
      error: (error) => {
        console.error('Erreur chargement stats:', error);
      }
    });
  }

  /**
   * Déclencher une synchronisation
   */
  triggerSync(limit: number = 50, includePackages: boolean = false) {
    this.syncInProgress = true;
    
    this.consoleConnectService.triggerSync(limit, includePackages).subscribe({
      next: (response) => {
        console.log('Synchronisation déclenchée:', response);
        this.syncInProgress = false;
        this.loadSyncStatus();
        this.loadSyncLogs();
      },
      error: (error) => {
        console.error('Erreur synchronisation:', error);
        this.syncInProgress = false;
      }
    });
  }

  /**
   * Charger les logs de synchronisation
   */
  loadSyncLogs() {
    this.consoleConnectService.getSyncLogs().subscribe({
      next: (response) => {
        this.syncLogs = response.logs || [];
      },
      error: (error) => {
        console.error('Erreur chargement logs:', error);
      }
    });
  }

  /**
   * Tester la connexion Console Connect
   */
  testConnection() {
    this.isLoading = true;
    this.consoleConnectService.testConnection().subscribe({
      next: (response) => {
        console.log('Test connexion:', response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur test connexion:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Synchronisation rapide (50 eSIMs)
   */
  quickSync() {
    this.triggerSync(50, false);
  }

  /**
   * Synchronisation complète (100 eSIMs + packages)
   */
  fullSync() {
    this.triggerSync(100, true);
  }

  /**
   * Synchronisation test (5 eSIMs)
   */
  testSync() {
    this.triggerSync(5, true);
  }
} 