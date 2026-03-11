import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.scss']
})
export class DashboardLayoutComponent {
  sidebarOpen = signal(true);
get user() {
  return this.auth.currentUser();
}
  senderNav: NavItem[] = [
    { icon: '', label: 'Dashboard',    route: '/dashboard/sender' },
    { icon: '', label: 'My Requests',  route: '/dashboard/sender/requests' },
    { icon: '', label: 'Browse Trips', route: '/dashboard/sender/trips' },
    { icon: '', label: 'Messages',     route: '/dashboard/messages', badge: 3 },
    { icon: '', label: 'Tracking',     route: '/dashboard/tracking' },
    { icon: '', label: 'Ratings',      route: '/dashboard/ratings' },
  ];

  transporterNav: NavItem[] = [
    { icon: '', label: 'Dashboard',   route: '/dashboard/transporter' },
    { icon: '', label: 'My Trips',    route: '/dashboard/transporter/trips' },
    { icon: '', label: 'Requests',    route: '/dashboard/transporter/requests' },
    { icon: '', label: 'Messages',    route: '/dashboard/messages', badge: 2 },
    { icon: '', label: 'Tracking',    route: '/dashboard/tracking' },
    { icon: '', label: 'Earnings',    route: '/dashboard/transporter/earnings' },
    { icon: '', label: 'Ratings',     route: '/dashboard/ratings' },
        { icon: '', label: 'Settings',    route: '/dashboard/settings' },
  ];

  navItems = computed(() =>
    this.user?.role === 'TRANSPORTEUR' ? this.transporterNav : this.senderNav
  );

  constructor(public auth: AuthService, private router: Router) {}

  toggleSidebar() { this.sidebarOpen.update(v => !v); }

  logout() { this.auth.logout(); }

  getInitials(): string {
    const u = this.user;
    if (!u) return '?';
    return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
  }
}