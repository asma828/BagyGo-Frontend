import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-container">
      <aside class="sidebar">
        <div class="logo">
          <span class="logo-text">Bagy<span>Go</span></span>
          <span class="badge">ADMIN</span>
        </div>
        
        <nav class="nav-links">
          <a routerLink="./dashboard" routerLinkActive="active" class="nav-item">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            </span> 
            Dashboard
          </a>
          <a routerLink="./users" routerLinkActive="active" class="nav-item">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </span> 
            Users
          </a>
          <a routerLink="./verifications" routerLinkActive="active" class="nav-item">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
            </span> 
            Verifications
          </a>
          <a routerLink="./monitoring" routerLinkActive="active" class="nav-item">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M14.5 9h5"/><path d="M14.5 15h5"/><path d="M14.5 12H21"/><path d="M2 9h5"/><path d="M2 15h5"/><path d="M2 12h10"/><path d="m16 20 2 2 4-4"/></svg>
            </span> 
            Monitoring
          </a>
        </nav>

        <div class="spacer"></div>

        <button (click)="logout()" class="logout-btn">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </span> 
          Logout
        </button>
      </aside>

      <main class="content">
        <header class="top-bar">
          <div class="breadcrumb">Admin Panel / <strong>{{ currentRoute() }}</strong></div>
          <div class="admin-profile">
            <div class="admin-avatar">AD</div>
            <span class="admin-email">{{ userEmail }}</span>
          </div>
        </header>
        
        <div class="page-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      height: 100vh;
      background-color: var(--light);
      font-family: var(--font-body);
    }

    .sidebar {
      width: 280px;
      background: var(--dark);
      color: white;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      box-shadow: var(--shadow-dark);
      z-index: 10;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2.5rem;
      padding: 0 0.5rem;
    }

    .logo-text {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 900;
      letter-spacing: -1px;
      color: white;
    }
    
    .logo-text span { color: var(--primary); }

    .badge {
      background: var(--primary);
      color: white;
      font-size: 0.65rem;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.25rem;
      border-radius: var(--radius-md);
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition-base);
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.05);
      color: white;
      transform: translateX(4px);
    }

    .nav-item.active {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 12px rgba(255,107,53,0.3);
    }

    .spacer { flex: 1; }

    .logout-btn {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      border-radius: var(--radius-md);
      background: rgba(252, 129, 129, 0.1);
      color: var(--danger);
      border: none;
      cursor: pointer;
      width: 100%;
      text-align: left;
      font-weight: 600;
      transition: var(--transition-fast);
    }

    .logout-btn:hover {
      background: rgba(252, 129, 129, 0.2);
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .top-bar {
      height: var(--topbar-height);
      background: var(--white);
      border-bottom: 1px solid rgba(26,26,46,0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2.5rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }

    .breadcrumb {
      color: var(--muted);
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .breadcrumb strong {
      color: var(--dark);
      font-weight: 700;
    }

    .admin-profile {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }
    
    .admin-avatar {
      width: 32px;
      height: 32px;
      background: var(--primary-pale);
      color: var(--primary);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.8rem;
    }

    .admin-email {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--dark);
    }

    .page-body {
      flex: 1;
      padding: 2.5rem;
      overflow-y: auto;
      background: var(--light);
    }
  `]
})
export class AdminLayoutComponent {
  private authSvc = inject(AuthService);
  private router = inject(Router);
  
  userEmail: string = '';
  currentRoute = signal<string>('Dashboard');

  constructor() {
    this.userEmail = this.authSvc.currentUser()?.email || 'Admin';
    
    // Watch route changes to update breadcrumb
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const url = this.router.url;
        if (url.includes('/users')) return 'User Management';
        if (url.includes('/verifications')) return 'Verifications';
        if (url.includes('/monitoring')) return 'Monitoring';
        return 'Dashboard';
      })
    ).subscribe(label => this.currentRoute.set(label));
  }

  logout() {
    this.authSvc.logout();
  }
}
