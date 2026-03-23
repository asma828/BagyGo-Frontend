import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-page">
      <h1 class="page-title">Platform Overview</h1>
      
      @if (stats()) {
        <div class="stats-grid animate-fade-in">
          <div class="stat-card">
            <div class="stat-icon users">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Users</span>
              <span class="stat-value">{{ stats().totalUsers }}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon trips">
              <i class="fas fa-plane-departure"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Trips</span>
              <span class="stat-value">{{ stats().totalTrips }}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon deliveries">
              <i class="fas fa-box"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Completed Deliveries</span>
              <span class="stat-value">{{ stats().totalDeliveries }}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon revenue">
              <i class="fas fa-sack-dollar"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Revenue</span>
              <span class="stat-value">{{ stats().totalRevenue | number:'1.2-2' }} MAD</span>
            </div>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="loading-overlay">
          <div class="spinner"></div>
          <p>Calculating live statistics...</p>
        </div>
      }

      @if (error()) {
        <div class="error-card animate-fade-in">
          <span class="error-icon">
            <i class="fas fa-circle-exclamation"></i>
          </span>
          <h3>Something went wrong</h3>
          <p>{{ error() }}</p>
          <button class="btn-retry" (click)="loadStats()">Try Again</button>
        </div>
      }

      <div class="row">
        <div class="card">
          <h3>
            <i class="fas fa-bolt section-icon"></i>
            Quick Management
          </h3>
          <div class="quick-actions">
            <button class="action-btn" routerLink="../users">
              <i class="fas fa-users"></i>
              Manage Users
            </button>
            <button class="action-btn" routerLink="../verifications">
              <i class="fas fa-shield-halved"></i>
              Transporter Verifications
            </button>
            <button class="action-btn" routerLink="../monitoring">
              <i class="fas fa-tower-broadcast"></i>
              Live Monitoring
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      animation: fadeIn 0.5s ease-out;
    }

    .page-title {
      font-family: var(--font-display);
      font-size: 2.25rem;
      font-weight: 900;
      color: var(--dark);
      letter-spacing: -0.5px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: var(--white);
      padding: 2rem;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: var(--shadow-card);
      transition: var(--transition-base);
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
    }

    .stat-icon.users { background: var(--secondary-pale); color: var(--secondary); }
    .stat-icon.trips { background: #F0FFF4; color: #48BB78; }
    .stat-icon.deliveries { background: #EBF8FF; color: #3182CE; }
    .stat-icon.revenue { background: var(--primary-pale); color: var(--primary); }

    .stat-label {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--muted);
      margin-bottom: 0.25rem;
    }

    .stat-value {
      display: block;
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--dark);
      font-family: var(--font-display);
    }

    .card {
      background: var(--white);
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
    }

    .card h3 {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      color: var(--dark);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .section-icon {
      color: var(--primary);
      font-size: 1.1rem;
    }

    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1.25rem;
    }

    .action-btn {
      padding: 1rem 1.75rem;
      border-radius: var(--radius-full);
      border: 2px solid var(--primary-pale);
      background: var(--white);
      color: var(--primary-dark);
      cursor: pointer;
      font-weight: 700;
      font-size: 0.95rem;
      transition: var(--transition-base);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .action-btn:hover {
      background: var(--primary-pale);
      border-color: var(--primary);
      transform: translateY(-3px);
    }

    .loading-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem;
      background: var(--white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid var(--primary-pale);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1.5rem;
    }

    .error-card {
      background: #FFF5F5;
      padding: 3rem;
      border-radius: var(--radius-lg);
      text-align: center;
      border: 1px solid #FED7D7;
    }

    .error-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
      color: #C53030;
    }

    .error-card h3 {
      color: #C53030;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .error-card p {
      color: #9B2C2C;
      margin-bottom: 1.5rem;
    }

    .btn-retry {
      padding: 0.75rem 2rem;
      background: #C53030;
      color: white;
      border-radius: var(--radius-full);
      font-weight: 700;
      border: none;
      cursor: pointer;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<any>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private adminSvc: AdminService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading.set(true);
    this.error.set(null);
    this.stats.set(null);

    this.adminSvc.getStats().subscribe({
      next: (res: any) => {
        this.stats.set(res);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load stats', err);
        this.error.set('Could not fetch platform statistics. Please check your connection or wait a moment.');
        this.loading.set(false);
      }
    });
  }
}