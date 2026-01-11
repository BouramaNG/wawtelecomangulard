import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats, RecentActivity, SalesChartData, EsimStatusChartData } from '../../services/dashboard.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.css'
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {
  
  stats: DashboardStats | null = null;
  activities: RecentActivity[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  // Graphique des ventes (Line Chart)
  public salesChartType: ChartType = 'line';
  public salesChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Revenus (FCFA)',
        backgroundColor: 'rgba(255, 221, 51, 0.2)',
        borderColor: '#FFDD33',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#333',
        pointBorderColor: '#FFDD33',
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        data: [],
        label: 'Commandes',
        backgroundColor: 'rgba(51, 51, 51, 0.2)',
        borderColor: '#333',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FFDD33',
        pointBorderColor: '#333',
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: 'y1'
      }
    ]
  };
  public salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#333',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(51, 51, 51, 0.9)',
        padding: 12,
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        borderColor: '#FFDD33',
        borderWidth: 2,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#333',
          font: {
            size: 12,
            weight: 'bold'
          },
          callback: function(value) {
            return new Intl.NumberFormat('fr-FR').format(value as number) + ' FCFA';
          }
        },
        grid: {
          color: 'rgba(51, 51, 51, 0.1)'
        }
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        ticks: {
          color: '#333',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          color: '#333',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(51, 51, 51, 0.1)'
        }
      }
    }
  };

  // Graphique statut eSIMs (Pie Chart)
  public esimStatusChartType: ChartType = 'doughnut';
  public esimStatusChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FFDD33',
        '#4CAF50',
        '#FF9800',
        '#F44336',
        '#2196F3',
        '#9C27B0'
      ],
      borderColor: '#fff',
      borderWidth: 3,
      hoverBorderWidth: 5
    }]
  };
  public esimStatusChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          font: {
            size: 13,
            weight: 'bold'
          },
          color: '#333',
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(51, 51, 51, 0.9)',
        padding: 12,
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        borderColor: '#FFDD33',
        borderWidth: 2,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  private refreshInterval: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    // Rafraîchir les données toutes les 30 secondes
    this.refreshInterval = setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    this.dashboardService.getStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
          this.activities = response.activities || [];
          
          // Mettre à jour le graphique des ventes
          if (response.charts?.sales) {
            this.updateSalesChart(response.charts.sales);
          }
          
          // Mettre à jour le graphique statut eSIMs
          if (response.charts?.esim_status) {
            this.updateEsimStatusChart(response.charts.esim_status);
          }
        } else {
          this.error = 'Erreur lors du chargement des données';
          this.showError('Erreur', 'Impossible de charger les statistiques du dashboard');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur dashboard:', err);
        this.error = 'Erreur de connexion au serveur';
        this.isLoading = false;
        this.showError('Erreur', 'Impossible de se connecter au serveur. Vérifiez votre connexion.');
      }
    });
  }

  updateSalesChart(salesData: SalesChartData): void {
    this.salesChartData = {
      labels: salesData.labels,
      datasets: [
        {
          ...this.salesChartData.datasets[0],
          data: salesData.revenues
        },
        {
          ...this.salesChartData.datasets[1],
          data: salesData.orders
        }
      ]
    };
  }

  updateEsimStatusChart(statusData: EsimStatusChartData): void {
    this.esimStatusChartData = {
      labels: statusData.labels,
      datasets: [{
        ...this.esimStatusChartData.datasets[0],
        data: statusData.data
      }]
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'order':
        return '🛒';
      case 'package':
        return '📦';
      case 'esim':
        return '📱';
      default:
        return '📌';
    }
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  showError(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#333',
      confirmButtonText: 'OK'
    });
  }
}
